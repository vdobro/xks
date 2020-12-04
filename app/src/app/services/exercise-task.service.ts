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

// @ts-ignore
import {v4 as uuid} from 'uuid';

import {Injectable} from '@angular/core';
import {TableCellService} from "./table-cell.service";
import {Table} from "../models/Table";
import {TableColumn} from "../models/TableColumn";
import {TableRow} from "../models/TableRow";
import {Graph} from "../models/Graph";
import {GraphElementService} from "./graph-element.service";
import {GraphEdgeRepository} from "../repositories/graph-edge-repository.service";
import {GraphNode} from "../models/GraphNode";
import {levenshtein} from "../../environments/utils";
import {AnswerValue} from "../models/AnswerValue";
import {AnswerValueRepository} from "../repositories/answer-value-repository.service";
import {ExerciseTask} from "./models/exercise-task";
import {FlashcardField} from "./models/flashcard-field";
import {AnswerFeedback} from "./models/answer-feedback";
import {FlashcardSet} from "../models/FlashcardSet";
import {FlashcardRepository} from "../repositories/flashcard-repository.service";

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

	constructor(
		private readonly tableCellService: TableCellService,
		private readonly graphElementService: GraphElementService,
		private readonly graphEdgeRepository: GraphEdgeRepository,
		private readonly flashcardRepository: FlashcardRepository,
		private readonly answerValueRepository: AnswerValueRepository) {
	}

	async getTableTaskList(table: Table,
						   questionColumns: TableColumn[],
						   answerColumns: TableColumn[],
						   startScore: number,
						   maxScore: number): Promise<ExerciseTask[]> {
		const rows = await this.tableCellService.getRows(table);
		const tasks : ExerciseTask[] = [];
		for (let row of rows) {
			const answerFields = await Promise.all(answerColumns.map(column =>
				this.mapColumnToFlashcardField(row, column)));
			const questions = await Promise.all(questionColumns.map(column =>
				this.mapColumnToFlashcardField(row, column)));
			tasks.push({
				id: uuid(),
				ignoreAnswerOrder: false,
				questions: questions,
				answers: answerFields,
				pendingAnswers: answerFields,
				doneAnswers: [],
				startingScore: startScore,
				maxScore: maxScore,
			});
		}
		return tasks;
	}

	async getGraphTaskList(graph: Graph,
						   startScore: number,
						   maxScore: number): Promise<ExerciseTask[]> {
		const nodes = await this.graphElementService.getNodes(graph);
		const exercises: ExerciseTask[] = [];
		for (let node of nodes) {
			const edges = await this.graphEdgeRepository.getAllFrom(node);
			const transitions: EdgeWithDestinationNode[] = [];
			for (let edge of edges) {
				const targetNode = await this.graphElementService.getNodeById(edge.targetNodeId);
				transitions.push({
					edgeName: edge.name,
					node: targetNode,
				});
			}
			const answerFields = await Promise.all(transitions.map(this.mapEdgeToFlashcardField));
			const ignoreAnswerOrder = edges.every(x => x.name === '');
			if (answerFields.length > 0) {
				exercises.push({
					id: uuid(),
					ignoreAnswerOrder: ignoreAnswerOrder,
					answers: answerFields,
					pendingAnswers: answerFields,
					questions: [await this.mapNodeToFlashcardField(node)],
					doneAnswers: [],
					startingScore: startScore,
					maxScore: maxScore,
				});
			}
		}
		return exercises;
	}

	async getFlashcardTaskList(set: FlashcardSet, startScore: number, maxScore: number) : Promise<ExerciseTask[]> {
		const cards = await this.flashcardRepository.getAllInSet(set.id);
		//TODO
		return [];
	}

	logInAnswer(answerValue: string,
				fieldId: string,
				task: ExerciseTask,
				lastAnswerFieldId: string | null): AnswerFeedback {
		if (!this.taskStateExists(task)) {
			this.registerTask(task);
		}
		const currentState = this.getState(task);
		const field = this.determineFieldToCheck(answerValue, fieldId, task, lastAnswerFieldId);
		const expectedAnswer = field.value;
		const answerCorrect = ExerciseTaskService.checkIfAnswerValueIsIn(answerValue, expectedAnswer);
		this.updateScore(currentState, task.maxScore, answerCorrect, field);
		this.taskStates.set(task.id, currentState);
		return {
			input: answerValue,
			correct: answerCorrect,
			actualField: field
		};
	}

	forceAcceptAnswer(currentValue: string, fieldId: string, task: ExerciseTask): AnswerFeedback {
		const currentState = this.getState(task);
		const field = task.answers.find(field => field.identifier.id === fieldId)!!;

		ExerciseTaskService.revertTaskState(currentState, field);

		this.updateScore(currentState, task.maxScore, true, field);
		this.taskStates.set(task.id, currentState);

		return {
			correct: true,
			input: currentValue,
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
		return this.getState(task).score.value;
	}

	isComplete(task: ExerciseTask): boolean {
		return this.getCurrentScore(task) >= task.maxScore;
	}

	private getState(task: ExerciseTask): TaskState {
		return this.taskStates.get(task.id)!!;
	}

	private determineFieldToCheck(answerValue: string,
								  fieldId: string,
								  task: ExerciseTask,
								  lastAnswerFieldId: string | null): FlashcardField {
		if (task.ignoreAnswerOrder && task.pendingAnswers.length > 0) {
			return this.getFieldWithClosestValue(answerValue, task.pendingAnswers);
		} else if (!task.ignoreAnswerOrder) {
			return task.answers.find(field => field.identifier.id === fieldId)!!;
		} else {
			return task.answers.find(field => field.identifier.id === lastAnswerFieldId)!!;
		}
	}

	private getFieldWithClosestValue(value: string, fields: FlashcardField[]): FlashcardField {
		const fieldAnswers : {
			value: string,
			flashcard: FlashcardField,
			isAlternative: boolean
		}[] = [];
		for (let field of fields) {
			fieldAnswers.push({
				value: field.value.defaultValue,
				isAlternative : false,
				flashcard: field
			});
			for (let alternative of field.value.alternatives) {
				fieldAnswers.push({
					value: alternative,
					isAlternative: true,
					flashcard: field
				})
			}
		}
		const sorted = fieldAnswers.sort((a, b) => {
			const distanceA = levenshtein(value, a.value);
			const distanceB = levenshtein(value, b.value);
			return distanceA < distanceB
				? -1
				: (distanceA > distanceB
					? 1
					: (!a.isAlternative && b.isAlternative
						? -1
						: (a.isAlternative && !b.isAlternative ? 1 : 0)));
		});
		return sorted[0].flashcard;
	}

	private updateScore(currentState: TaskState,
						maximumScoreAllowed: number,
						answerCorrect: boolean,
						field: FlashcardField) {
		const columnId = field.identifier.id;
		if (answerCorrect) {
			const subscores = currentState.columnSubscores;
			const subscore = subscores.get(columnId)!!;
			const globalMaxScore = maximumScoreAllowed;
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
			value: task.startingScore,
			previous: null,
		};
		for (let answerField of task.answers) {
			subscores.set(answerField.identifier.id, startScore);
		}
		this.taskStates.set(task.id, {
			score: startScore,
			columnSubscores: subscores,
		});
	}

	private async mapColumnToFlashcardField(row: TableRow, column: TableColumn): Promise<FlashcardField> {
		const value = await this.answerValueRepository.getById(row.valueIds.get(column.id)!!);
		return {
			identifier: column,
			value: value,
		};
	}

	private async mapEdgeToFlashcardField(transition: EdgeWithDestinationNode): Promise<FlashcardField> {
		const value = await this.answerValueRepository.getById(transition.node.valueId);
		return {
			identifier: {
				id: transition.node.id,
				name: transition.edgeName,
			},
			value: value,
		};
	}

	private async mapNodeToFlashcardField(node: GraphNode): Promise<FlashcardField> {
		return {
			identifier: {
				id: node.id,
				name: '',
			},
			value: await this.answerValueRepository.getById(node.valueId),
		}
	}

	private static checkIfAnswerValueIsIn(answer: string, expected: AnswerValue) : boolean {
		return expected.defaultValue === answer || expected.alternatives.find(x => x === answer) !== undefined;
	}

	private static revertTaskState(state: TaskState, field: FlashcardField) {
		const subscores = state.columnSubscores;
		const columnId = field.identifier.id;
		const subscore = subscores.get(columnId)!!;
		subscores.set(columnId, this.revertScoreIfLess(subscore));
		state.score = this.revertScoreIfLess(state.score);
	}

	private static revertScoreIfLess(score: TaskScore) {
		if (!score.previous) {
			return score;
		}
		if (score.value < score.previous.value) {
			score.value = score.previous.value;
			score.previous = score.previous.previous;
		}
		return score;
	}

	private static incrementMainScoreIfPossible(state: TaskState) : void {
		const old = state.score.value;
		const subscores = state.columnSubscores;
		if (Array.from(subscores.values()).every(score => score.value > old)) {
			state.score = this.incrementScore(state.score);
		}
	}

	private static incrementSubscore(state: TaskState, columnId: string) : void {
		const subscores = state.columnSubscores;
		const subscore = subscores.get(columnId)!!;
		subscores.set(columnId, this.incrementScore(subscore));
	}

	private static changeSubscore(state: TaskState, columnId: string, value: number) : void {
		const subscores = state.columnSubscores;
		const subscore = subscores.get(columnId)!!;
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
}

interface TaskState {
	score: TaskScore,
	columnSubscores: Map<string, TaskScore>,
}

interface TaskScore {
	value: number,
	previous: TaskScore | null,
}

interface EdgeWithDestinationNode {
	node: GraphNode,
	edgeName: string,
}
