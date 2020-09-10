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

	private readonly defaultMinimumScore = 0;
	private readonly defaultStartScore = 0;
	readonly defaultMaximumScore = 2;

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

	resetTask(task: ExerciseTask) {
		this.taskStates.delete(task.id);
	}

	getScore(task: ExerciseTask): number {
		if (!this.taskStateExists(task)) {
			this.registerTask(task);
		}
		return this.taskStates.get(task.id).score;
	}

	isComplete(task: ExerciseTask): boolean {
		return this.getScore(task) >= this.getMaxScore(task);
	}

	private getMaxScore(task: ExerciseTask): number {
		if (!this.taskStateExists(task)) {
			this.registerTask(task);
		}
		return this.taskStates.get(task.id).maxScore;
	}

	private updateScore(currentState: TaskState,
						answerCorrect: boolean,
						field: FlashcardField): boolean {
		const columnId = field.column.id;
		const subscores = currentState.columnSubscores;
		const oldScore = currentState.score;
		if (answerCorrect) {
			const currentSubscore = subscores.get(columnId);
			if (currentSubscore < currentState.maxScore) {
				subscores.set(columnId, currentSubscore + 1);
			}
			for (let subscore of subscores.values()) {
				if (subscore <= oldScore) {
					return;
				}
			}
			currentState.score++;
		} else {
			subscores.set(columnId, 0);
			currentState.score = this.defaultMinimumScore;
		}
	}

	private taskStateExists(task: ExerciseTask): boolean {
		return this.taskStates.has(task.id);
	}

	private registerTask(task: ExerciseTask) {
		if (this.taskStateExists(task)) {
			return;
		}
		const subscores = new Map<string, number>();
		for (let answerField of task.answerValues) {
			subscores.set(answerField.column.id, 0);
		}
		this.taskStates.set(task.id, {
			maxScore: this.defaultMaximumScore,
			score: this.defaultStartScore,
			columnSubscores: subscores,
		});
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
	score: number,
	columnSubscores: Map<string, number>
	maxScore: number,
}

export interface AnswerFeedback {
	correct: boolean,
	actualValue: string,
}
