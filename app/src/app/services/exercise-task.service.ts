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

import {levenshtein} from "@environments/utils";

import {Table} from "@app/models/table";
import {TableColumn} from "@app/models/table-column";
import {TableRow} from "@app/models/table-row";
import {Graph} from "@app/models/graph";
import {GraphNode} from "@app/models/graph-node";
import {FlashcardSet} from "@app/models/flashcard-set";
import {AnswerValue} from "@app/models/answer-value";

import {GraphElementService} from "@app/services/graph-element.service";
import {ExerciseTask} from "@app/services/models/exercise-task";
import {FlashcardField} from "@app/services/models/flashcard-field";
import {AnswerFeedback} from "@app/services/models/answer-feedback";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.14
 */
@Injectable({
	providedIn: 'root'
})
export class ExerciseTaskService {

	private readonly taskStates: Map<string, TaskState> = new Map<string, TaskState>();

	private readonly defaultMinimumScore: number = 0;

	constructor(
		private readonly graphElementService: GraphElementService) {
	}

	getTableTaskList(table: Table,
					 questionColumns: TableColumn[],
					 answerColumns: TableColumn[],
					 startScore: number,
					 maxScore: number): ExerciseTask[] {
		const tasks: ExerciseTask[] = [];
		for (const row of table.rows) {
			const answerFields = answerColumns.map(column => this.mapColumnToFlashcardField(row, column));
			const questions = questionColumns.map(column => this.mapColumnToFlashcardField(row, column));
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

	getGraphTaskList(graph: Graph, startScore: number, maxScore: number): ExerciseTask[] {
		const exercises: ExerciseTask[] = [];
		for (const node of graph.nodes) {
			const edges = GraphElementService.getOutgoingEdges(node, graph);
			const transitions: EdgeWithDestinationNode[] = [];
			for (const edge of edges) {
				const targetNode = this.graphElementService.getNode(edge.targetId, graph);
				transitions.push({
					edgeName: edge.value.default,
					node: targetNode,
				});
			}
			const answerFields = transitions.map(transition => ExerciseTaskService.mapEdgeToFlashcardField(transition));
			const ignoreAnswerOrder = edges.every(x => x.value.default === '');
			if (answerFields.length > 0) {
				exercises.push({
					id: uuid(),
					ignoreAnswerOrder: ignoreAnswerOrder,
					answers: answerFields,
					pendingAnswers: answerFields,
					questions: [ExerciseTaskService.mapNodeToFlashcardField(node)],
					doneAnswers: [],
					startingScore: startScore,
					maxScore: maxScore,
				});
			}
		}
		return exercises;
	}

	getFlashcardTaskList(set: FlashcardSet, startScore: number, maxScore: number): ExerciseTask[] {
		return set.cards.map(card => {
			const questions : FlashcardField[] = [{
				identifier: {
					id: card.id,
					name: 'Question',
				},
				value: {
					default: card.question,
					alternatives: [],
				}
			}];
			const answers : FlashcardField[] = [{
				identifier: {
					id: card.id,
					name: 'Answer',
				},
				value: card.value,
			}];
			const task: ExerciseTask = {
				questions: questions,
				pendingAnswers: answers,
				answers: answers,
				ignoreAnswerOrder: false,
				doneAnswers: [],
				startingScore: startScore,
				maxScore: maxScore,
				id: uuid(),
			};
			return task;
		});
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
		const field = task.answers.find(field => field.identifier.id === fieldId)!;

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
		return this.taskStates.get(task.id)!;
	}

	private determineFieldToCheck(answerValue: string,
								  fieldId: string,
								  task: ExerciseTask,
								  lastAnswerFieldId: string | null): FlashcardField {
		if (task.ignoreAnswerOrder && task.pendingAnswers.length > 0) {
			return this.getFieldWithClosestValue(answerValue, task.pendingAnswers);
		} else if (!task.ignoreAnswerOrder) {
			return task.answers.find(field => field.identifier.id === fieldId)!;
		} else {
			return task.answers.find(field => field.identifier.id === lastAnswerFieldId)!;
		}
	}

	private getFieldWithClosestValue(value: string, fields: FlashcardField[]): FlashcardField {
		const fieldAnswers: {
			value: string,
			flashcard: FlashcardField,
			isAlternative: boolean
		}[] = [];
		for (const field of fields) {
			fieldAnswers.push({
				value: field.value.default,
				isAlternative: false,
				flashcard: field
			});
			for (const alternative of field.value.alternatives) {
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
			const subscore = subscores.get(columnId)!;
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
		for (const answerField of task.answers) {
			subscores.set(answerField.identifier.id, startScore);
		}
		this.taskStates.set(task.id, {
			score: startScore,
			columnSubscores: subscores,
		});
	}

	private mapColumnToFlashcardField(row: TableRow, column: TableColumn): FlashcardField {
		const columnValue = row.columnValues.find(x => x.columnId === column.id)!;
		return {
			identifier: column,
			value: columnValue.value,
		};
	}

	private static mapEdgeToFlashcardField(transition: EdgeWithDestinationNode): FlashcardField {
		const value = transition.node.value;
		return {
			identifier: {
				id: transition.node.id,
				name: transition.edgeName,
			},
			value: value,
		};
	}

	private static mapNodeToFlashcardField(node: GraphNode): FlashcardField {
		return {
			identifier: {
				id: node.id,
				name: '',
			},
			value: node.value
		}
	}

	private static checkIfAnswerValueIsIn(answer: string, expected: AnswerValue): boolean {
		return expected.default === answer || expected.alternatives.find(x => x === answer) !== undefined;
	}

	private static revertTaskState(state: TaskState, field: FlashcardField) {
		const subscores = state.columnSubscores;
		const columnId = field.identifier.id;
		const subscore = subscores.get(columnId)!;
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

	private static incrementMainScoreIfPossible(state: TaskState): void {
		const old = state.score.value;
		const subscores = state.columnSubscores;
		if (Array.from(subscores.values()).every(score => score.value > old)) {
			state.score = this.incrementScore(state.score);
		}
	}

	private static incrementSubscore(state: TaskState, columnId: string): void {
		const subscores = state.columnSubscores;
		const subscore = subscores.get(columnId)!;
		subscores.set(columnId, this.incrementScore(subscore));
	}

	private static changeSubscore(state: TaskState, columnId: string, value: number): void {
		const subscores = state.columnSubscores;
		const subscore = subscores.get(columnId)!;
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
