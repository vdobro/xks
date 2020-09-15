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

import * as levenshtein from 'fast-levenshtein';
import {v4 as uuid} from 'uuid';
import {Injectable} from '@angular/core';
import {TableCellService} from "./table-cell.service";
import {Table} from "../models/Table";
import {TableColumn} from "../models/TableColumn";
import {TableRow} from "../models/TableRow";
import {Graph} from "../models/Graph";
import {GraphElementService} from "./graph-element.service";
import {GraphEdgeRepository} from "../repositories/graph-edge-repository.service";
import {BaseEntity} from "../models/BaseEntity";
import {GraphNode} from "../models/GraphNode";

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
		private readonly tableCellService: TableCellService,
		private readonly graphElementService: GraphElementService,
		private readonly graphEdgeRepository: GraphEdgeRepository) {
	}

	async getTableTaskList(table: Table,
						   questionColumns: TableColumn[],
						   answerColumns: TableColumn[]): Promise<ExerciseTask[]> {
		const rows = await this.tableCellService.getRows(table);
		return rows.map(row => {
			const answerFields = answerColumns.map(column =>
				ExerciseTaskService.mapColumnToFlashcardField(row, column));
			return {
				id: uuid(),
				ignoreAnswerOrder: false,
				elementId: row.id,
				questionValues: questionColumns.map(column =>
					ExerciseTaskService.mapColumnToFlashcardField(row, column)),
				answerValues: answerFields,
				pendingAnswerFields: answerFields,
			};
		});
	}

	async getGraphTaskList(graph: Graph): Promise<ExerciseTask[]> {
		const nodes = await this.graphElementService.getNodes(graph);
		const exercises: ExerciseTask[] = [];
		for (let node of nodes) {
			const edges = await this.graphEdgeRepository.getAllFrom(node);
			const targetNodes = await Promise.all(edges.map(edge => this.graphElementService.getNodeById(edge.targetNodeId)));
			const answerFields = targetNodes.map(ExerciseTaskService.mapNodeToFlashcardField);
			if (answerFields.length > 0) {
				exercises.push({
					id: uuid(),
					ignoreAnswerOrder: true,
					answerValues: answerFields,
					pendingAnswerFields: answerFields,
					questionValues: [ExerciseTaskService.mapNodeToFlashcardField(node)],
				});
			}
		}
		return exercises;
	}

	logInAnswer(answerValue: string, fieldId: string, task: ExerciseTask, lastAnswerFieldId: string): AnswerFeedback {
		if (!this.taskStateExists(task)) {
			this.registerTask(task);
		}
		const currentState = this.taskStates.get(task.id);
		const field = task.ignoreAnswerOrder && task.pendingAnswerFields.length > 0
			? this.getFieldWithClosestValue(answerValue, task.pendingAnswerFields)
			: (!task.ignoreAnswerOrder
				? task.answerValues.find(field => field.identifier.id === fieldId)
				: task.answerValues.find(field => field.identifier.id === lastAnswerFieldId));
		const expectedAnswer = field.value;
		const answerCorrect = answerValue === expectedAnswer;
		this.updateScore(currentState, answerCorrect, field);
		this.taskStates.set(task.id, currentState);
		return {
			correct: answerCorrect,
			actualField: field
		};
	}

	forceAcceptAnswer(fieldId: string, task: ExerciseTask): AnswerFeedback {
		const currentState = this.taskStates.get(task.id);
		const field = task.answerValues.find(field => field.identifier.id === fieldId);

		ExerciseTaskService.revertTaskState(currentState, field);

		this.updateScore(currentState, true, field);
		this.taskStates.set(task.id, currentState);

		return {
			correct: true,
			actualField: field
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

	private getFieldWithClosestValue(value: string, fields: FlashcardField[]): FlashcardField {
		const sorted = fields.sort((a, b) => {
			const distanceA = levenshtein.get(value, a.value);
			const distanceB = levenshtein.get(value, b.value);
			return distanceA < distanceB ? -1 : (distanceA > distanceB ? 1 : 0);
		});
		return sorted[0];
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
		const columnId = field.identifier.id;
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
			subscores.set(answerField.identifier.id, startScore);
		}
		this.taskStates.set(task.id, {
			maxScore: this.defaultMaximumScore,
			score: startScore,
			columnSubscores: subscores,
		});
	}

	private static revertTaskState(state: TaskState, field: FlashcardField) {
		const subscores = state.columnSubscores;
		const columnId = field.identifier.id;
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
			identifier: column,
			value: row.values.get(column.id),
		};
	}

	private static mapNodeToFlashcardField(graphNode: GraphNode): FlashcardField {
		return {
			identifier: {
				id: graphNode.id,
				name: '',
			},
			value: graphNode.value,
		};
	}
}

export interface ExerciseTask {
	id: string,
	ignoreAnswerOrder: boolean,
	questionValues: FlashcardField[],
	answerValues: FlashcardField[],
	pendingAnswerFields: FlashcardField[],
}

export interface FlashcardField {
	identifier: NamedEntity,
	value: string,
}

export interface NamedEntity extends BaseEntity {
	name: string
}

export interface AnswerFeedback {
	correct: boolean,
	actualField: FlashcardField,
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
