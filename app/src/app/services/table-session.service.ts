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
import {Table} from "../models/Table";
import {AnswerFeedback, ExerciseTask, ExerciseTaskService} from "./exercise-task.service";
import {TableColumnRepository} from "../repositories/table-column-repository.service";
import {TableSessionMode} from "../models/TableSessionMode";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.14
 */
@Injectable({
	providedIn: 'root'
})
export class TableSessionService {

	private readonly defaultTaskWindowSize = 10;

	private readonly activeSessions = new Map<string, InternalSessionState>();

	constructor(
		private readonly columnRepository: TableColumnRepository,
		private readonly taskService: ExerciseTaskService) {
	}

	async startNew(table: Table, sessionMode: TableSessionMode): Promise<LearningSessionState<TableSession>> {
		const session: TableSession = TableSessionService.createSession(table);

		const questionColumns = await Promise.all(sessionMode.questionColumnIds
			.map(async id => await this.columnRepository.getById(id)));
		const answerColumns = await Promise.all(sessionMode.answerColumnIds
			.map(async id => await this.columnRepository.getById(id)));
		const allTasks = await this.taskService.getTaskList(table, questionColumns, answerColumns);

		const actualInitialWindowSize = Math.min(allTasks.length, this.defaultTaskWindowSize);
		const initialWindow = allTasks.slice(0, actualInitialWindowSize);
		const remainingTasks = allTasks.slice(actualInitialWindowSize);
		const state: LearningSessionState<TableSession> = {
			currentTask: TableSessionService.randomElement(initialWindow),
			session: session,
			progress: 0,
			lastAnswer: undefined
		};
		this.updateInternalState({
			remainingTasks: remainingTasks,
			sessionState: state,
			tasksDone: [],
			taskWindow: initialWindow
		});
		state.progress = this.calculateProgress(state);
		return state;
	}

	submitAnswer(answer: string,
				 columnId: string,
				 state: LearningSessionState<TableSession>)
		: LearningSessionState<TableSession> {
		this.removePendingAnswerField(columnId, state.currentTask);
		const answerFeedback = this.taskService.logInAnswer(answer, columnId, state.currentTask);
		return this.handleAnswerFeedback(columnId, answerFeedback, state);
	}

	acceptLastAnswer(state: LearningSessionState<TableSession>): LearningSessionState<TableSession> {
		const columnId = state.lastAnswer.columnId;
		const lastTask = state.lastAnswer.task;
		const answerFeedback = this.taskService.forceAcceptAnswer(columnId, lastTask);
		return this.handleAnswerFeedback(columnId, answerFeedback, state);
	}

	cleanup() {
		this.taskService.resetTasks();
	}

	private handleAnswerFeedback(columnId: string,
								 answerFeedback: AnswerFeedback,
								 state: LearningSessionState<TableSession>): LearningSessionState<TableSession> {
		this.updateActiveTaskWindow(state);
		const allFieldsSubmitted = state.currentTask.pendingAnswerFields.length === 0;

		const lastColumnAndTaskEqual = (columnId === state.lastAnswer?.columnId
			&& state.lastAnswer?.task.id === state.currentTask.id);

		state.lastAnswer = {
			correct: answerFeedback.correct,
			actualValue: answerFeedback.actualValue,
			task: state.currentTask,
			columnId: columnId
		};

		if (allFieldsSubmitted && (answerFeedback.correct || lastColumnAndTaskEqual)) {
			state.currentTask.pendingAnswerFields = state.currentTask.answerValues;
			state.currentTask = this.chooseNextLowestTask(state);
		}
		state.progress = this.calculateProgress(state);
		this.checkCompletion(state);
		return state;
	}

	private checkCompletion(state: LearningSessionState<TableSession>) {
		const internalState = this.getInternalState(state);
		if (internalState.remainingTasks.length === 0
			&& internalState.taskWindow.every(task => this.taskService.isComplete(task))) {
			state.session.end = new Date();
			state.session.complete = true;
		}
	}

	private removePendingAnswerField(columnId: string, currentTask: ExerciseTask) {
		const fields = currentTask.pendingAnswerFields;
		currentTask.pendingAnswerFields = fields.filter(x => x.column.id !== columnId);
	}

	private chooseNextLowestTask(state: LearningSessionState<TableSession>): ExerciseTask {
		const window = this.getTaskWindow(state);
		const sortedWindow = window
			.map(task => ({score: this.taskService.getCurrentScore(task), task: task,}))
			.sort((a, b) =>
				a.score < b.score ? -1 : (a.score > b.score ? 1 : 0))
			.filter((scoreWithTask, _) =>
				scoreWithTask.task.id !== state.currentTask.id);
		if (sortedWindow.length === 0) {
			return state.currentTask;
		}
		const lowestScore = sortedWindow[0].score;
		const lowestTasks = sortedWindow.filter(task => {
			return task.score === lowestScore
		});
		return TableSessionService.randomElement(lowestTasks).task;
	}

	private calculateProgress(state: LearningSessionState<TableSession>): number {
		const internalState = this.getInternalState(state);
		const startScore = this.taskService.defaultStartScore;
		const maxScore = this.taskService.defaultMaximumScore - startScore;

		const remainingTasks = internalState.remainingTasks.length;
		const doneTasks = internalState.tasksDone.length;
		const windowLength = internalState.taskWindow.length;

		const totalTasks = windowLength + remainingTasks + doneTasks;

		const pendingTaskScore = internalState.taskWindow
			.map(task => this.taskService.getCurrentScore(task) - startScore)
			.reduce((sum, current) => sum + current, 0);

		const progress = ((doneTasks * maxScore) + pendingTaskScore) / (totalTasks * maxScore);
		return Math.max(progress, 0);
	}

	private updateActiveTaskWindow(state: LearningSessionState<TableSession>) {
		const defaultWindowSize = this.getTaskWindow(state).length;
		this.removeDoneTasksFromWindow(state);

		while (this.getTaskWindow(state).length < defaultWindowSize) {
			const internalState = this.getInternalState(state);
			const selectedTask = TableSessionService.selectNewTaskFromAvailable(internalState);

			if (!selectedTask) {
				return;
			}
			internalState.taskWindow.push(selectedTask);
			internalState.remainingTasks = internalState.remainingTasks.filter(task =>
				task.id !== selectedTask.id);
		}
	}

	private removeDoneTasksFromWindow(state: LearningSessionState<TableSession>) {
		const internalState = this.getInternalState(state);
		const oldWindow = this.getTaskWindow(state);
		const newWindow: ExerciseTask[] = [];
		for (let task of oldWindow) {
			if (this.taskService.isComplete(task)) {
				internalState.tasksDone.push(task);
			} else {
				newWindow.push(task);
			}
		}
		internalState.taskWindow = newWindow;
	}

	private getTaskWindow(state: LearningSessionState<TableSession>)
		: ExerciseTask[] {
		return this.getInternalState(state).taskWindow;
	}

	private getInternalState(state: LearningSessionState<TableSession>) {
		return this.activeSessions.get(state.session.id);
	}

	private updateInternalState(internalState: InternalSessionState) {
		this.activeSessions.set(internalState.sessionState.session.id, internalState);
	}

	private static selectNewTaskFromAvailable(internalState: InternalSessionState): ExerciseTask | null {
		const remainingTasks = internalState.remainingTasks;
		const doneTasks = internalState.tasksDone;

		if (remainingTasks.length > 0) {
			return TableSessionService.randomElement(remainingTasks);
		} else if (doneTasks.length > 0) {
			const newTask = TableSessionService.randomElement(doneTasks);
			doneTasks.splice(doneTasks.indexOf(newTask), 1);
			return newTask;
		} else return null;
	}

	private static createSession(table: Table): TableSession {
		return {
			start: new Date(),
			end: null,
			complete: false,
			id: uuid(),
			tableId: table.id
		};
	}

	private static randomElement<T>(array: T[]): T {
		const start = 0;
		const end = array.length - 1;
		const index = this.random(start, end);
		return array[index];
	}

	private static random(start: number, end: number): number {
		return Math.floor(start + (Math.random() * (end - start)));
	}
}

export interface LearningSession {
	id: string,
	complete: boolean,
}

export interface TableSession extends LearningSession {
	tableId: string,
	start: Date,
	end: Date,
}

export interface LearningSessionState<TSession extends LearningSession> {
	session: TSession,
	currentTask: ExerciseTask,
	progress: number,
	lastAnswer: {
		correct: boolean,
		actualValue: string,
		columnId: string,
		task: ExerciseTask
	}
}

interface InternalSessionState {
	sessionState: LearningSessionState<TableSession>,
	taskWindow: ExerciseTask[],
	remainingTasks: ExerciseTask[],
	tasksDone: ExerciseTask[],
}
