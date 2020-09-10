/*
 * Copyright (C) 2020 Vitalijus Dobrovolskis
 *
 * This file is part of xks.
 *
 * xks is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, version 3 of the License.
 *
 * xks is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with xks; see the file LICENSE. If not,
 * see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {v4 as uuid} from 'uuid';
import {Injectable} from '@angular/core';
import {TableCellService} from "./table-cell.service";
import {Table} from "../models/Table";
import {TableColumn} from "../models/TableColumn";
import {TableRow} from "../models/TableRow";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.14
 */
@Injectable({
	providedIn: 'root'
})
export class ExerciseTaskService {

	private readonly taskStates = new Map<string, TaskState>();

	readonly defaultMinimumScore = 0;
	readonly defaultStartScore = 3;
	readonly defaultMaximumScore = 8;

	constructor(
		private readonly tableCellService: TableCellService) {
	}

	async getTaskList(table: Table,
					  questionColumns: TableColumn[],
					  answerColumns: TableColumn[]): Promise<ExerciseTask[]> {
		const rows = await this.tableCellService.getRows(table);
		return rows.map(row => {
			const answerFields = answerColumns.map(column =>
				ExerciseTaskService.mapColumnToFlashcardField(row, column));
			return {
				id: uuid(),
				rowId: row.id,
				questionValues: questionColumns.map(column =>
					ExerciseTaskService.mapColumnToFlashcardField(row, column)),
				answerValues: answerFields,
				pendingAnswerFields: answerFields,
			};
		});
	}

	logInAnswer(answerValue: string, columnId: string, task: ExerciseTask): AnswerFeedback {
		if (!this.taskStateExists(task)) {
			this.registerTask(task);
		}
		const currentState = this.taskStates.get(task.id);
		const field = task.answerValues.find(field => field.column.id === columnId);
		const expectedAnswer = field.value;
		const answerCorrect = answerValue === expectedAnswer;
		this.updateScore(currentState, answerCorrect, field);
		this.taskStates.set(task.id, currentState);
		return {
			correct: answerCorrect,
			actualValue: expectedAnswer
		};
	}

	forceAcceptAnswer(columnId: string, task: ExerciseTask): AnswerFeedback {
		const currentState = this.taskStates.get(task.id);
		const field = task.answerValues.find(field => field.column.id === columnId);

		ExerciseTaskService.revertTaskState(currentState, field);

		this.updateScore(currentState, true, field);
		this.taskStates.set(task.id, currentState);

		return {
			correct: true,
			actualValue: field.value
		}
	}

	resetTasks() {
		this.taskStates.clear();
	}

	getCurrentScore(task: ExerciseTask): number {
		if (!this.taskStateExists(task)) {
			this.registerTask(task);
		}
		return this.taskStates.get(task.id).score.value;
	}

	isComplete(task: ExerciseTask): boolean {
		return this.getCurrentScore(task) >= this.getMaxScore(task);
	}

	private getMaxScore(task: ExerciseTask): number {
		if (!this.taskStateExists(task)) {
			this.registerTask(task);
		}
		return this.taskStates.get(task.id).maxScore;
	}

	private updateScore(currentState: TaskState,
						answerCorrect: boolean,
						field: FlashcardField) {
		const columnId = field.column.id;
		if (answerCorrect) {
			const subscores = currentState.columnSubscores;
			const subscore = subscores.get(columnId);
			const globalMaxScore = currentState.maxScore;
			const localMaxScore = currentState.score.value + 2;
			if (subscore.value < globalMaxScore && subscore.value < localMaxScore) {
				ExerciseTaskService.incrementSubscore(currentState, columnId);
			}
			ExerciseTaskService.incrementMainScoreIfPossible(currentState);
		} else {
			ExerciseTaskService.changeSubscore(currentState, columnId, 0);
			currentState.score = ExerciseTaskService.changeScore(currentState.score, this.defaultMinimumScore);
		}
	}

	private taskStateExists(task: ExerciseTask): boolean {
		return this.taskStates.has(task.id);
	}

	private registerTask(task: ExerciseTask) {
		if (this.taskStateExists(task)) {
			return;
		}
		const subscores = new Map<string, TaskScore>();
		const startScore: TaskScore = {
			value: this.defaultStartScore,
			previous: undefined
		};
		for (let answerField of task.answerValues) {
			subscores.set(answerField.column.id, startScore);
		}
		this.taskStates.set(task.id, {
			maxScore: this.defaultMaximumScore,
			score: startScore,
			columnSubscores: subscores,
		});
	}

	private static revertTaskState(state: TaskState, field: FlashcardField) {
		const subscores = state.columnSubscores;
		const columnId = field.column.id;
		const subscore = subscores.get(columnId);
		subscores.set(columnId, this.revertScoreIfLess(subscore));
		state.score = this.revertScoreIfLess(state.score);
	}

	private static revertScoreIfLess(score: TaskScore) {
		if (score.value < score.previous.value) {
			score.value = score.previous.value;
			score.previous = score.previous.previous;
		}
		return score;
	}

	private static incrementMainScoreIfPossible(state: TaskState) {
		const old = state.score.value;
		const subscores = state.columnSubscores;
		if (Array.from(subscores.values()).every(score => score.value > old)) {
			state.score = this.incrementScore(state.score);
		}
	}

	private static incrementSubscore(state: TaskState, columnId: string) {
		const subscores = state.columnSubscores;
		const subscore = subscores.get(columnId);
		subscores.set(columnId, this.incrementScore(subscore));
	}

	private static changeSubscore(state: TaskState, columnId: string, value: number) {
		const subscores = state.columnSubscores;
		const subscore = subscores.get(columnId);
		subscores.set(columnId, this.changeScore(subscore, value));
	}

	private static incrementScore(score: TaskScore): TaskScore {
		return this.changeScore(score, score.value + 1);
	}

	private static changeScore(score: TaskScore, newValue: number): TaskScore {
		return {
			value: newValue,
			previous: score,
		}
	}

	private static mapColumnToFlashcardField(row: TableRow, column: TableColumn): FlashcardField {
		return {
			column: column,
			value: row.values.get(column.id),
		};
	}
}

export interface ExerciseTask {
	id: string,
	rowId: string,
	questionValues: FlashcardField[],
	answerValues: FlashcardField[],
	pendingAnswerFields: FlashcardField[],
}

export interface FlashcardField {
	column: TableColumn,
	value: string,
}

interface TaskState {
	score: TaskScore,
	columnSubscores: Map<string, TaskScore>
	maxScore: number,
}

interface TaskScore {
	value: number,
	previous: TaskScore,
}

export interface AnswerFeedback {
	correct: boolean,
	actualValue: string,
}
