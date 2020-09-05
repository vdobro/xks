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
import {ExerciseTask, ExerciseTaskService} from "./exercise-task.service";
import {TableColumnRepository} from "../repositories/table-column-repository.service";
import {TableLearningSessionMode} from "../models/TableLearningSessionMode";

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

	async startNew(table: Table, sessionMode: TableLearningSessionMode): Promise<LearningSessionState<TableSession>> {
		const session: TableSession = TableSessionService.createSession(table);

		const questionColumns = await Promise.all(sessionMode.questionColumnIds
			.map(async id => await this.columnRepository.getById(id)));
		const answerColumn = await this.columnRepository.getById(sessionMode.answerColumnId);
		const allTasks = await this.taskService.getTaskList(table, questionColumns, answerColumn);

		const actualInitialWindowSize = Math.min(allTasks.length, this.defaultTaskWindowSize);
		const initialWindow = allTasks.slice(0, actualInitialWindowSize);
		const remainingTasks = allTasks.slice(actualInitialWindowSize);
		this.updateInternalState({
			remainingTasks: remainingTasks,
			sessionState: {
				session: session,
				currentTask: initialWindow[0],
				progress: 0,
			},
			tasksDone: [],
			taskWindow: initialWindow
		});
		return {
			currentTask: TableSessionService.randomElement(initialWindow),
			session: session,
			progress: 0
		};
	}

	submitAnswer(answer: string, state: LearningSessionState<TableSession>)
		: LearningSessionState<TableSession> {

		this.taskService.logInAnswer(answer, state.currentTask);
		this.updateActiveTaskWindow(state);
		const window = this.getTaskWindow(state);

		const sortedWindow = window
			.map(task => ({ score: this.taskService.getScore(task), task: task,}))
			.sort((a, b) =>
				a.score < b.score ? -1 : (a.score > b.score ? 1 : 0));
		const lowestScore = sortedWindow[0].score;
		const lowestTasks = sortedWindow.filter(task => task.score === lowestScore);

		state.currentTask = TableSessionService.randomElement(lowestTasks).task;
		return state;
	}

	completeSession(state: LearningSessionState<TableSession>) {
		state.session.end = new Date();
	}

	private updateActiveTaskWindow(state: LearningSessionState<TableSession>) {
		this.removeDoneTasksFromWindow(state);

		while (this.getTaskWindow(state).length < this.defaultTaskWindowSize) {
			const remainingTasks = this.getRemainingTasks(state);
			const internalState = this.getInternalState(state);

			const selectedTask = TableSessionService.randomElement(remainingTasks);
			internalState.taskWindow.push(selectedTask);
			internalState.remainingTasks = remainingTasks.filter(task => task.id !== selectedTask.id);
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

	private getRemainingTasks(state: LearningSessionState<TableSession>): ExerciseTask[] {
		const stateInformation = this.getInternalState(state);
		return stateInformation.remainingTasks;
	}

	private getInternalState(state: LearningSessionState<TableSession>) {
		return this.activeSessions.get(state.session.id);
	}

	private updateInternalState(internalState: InternalSessionState) {
		this.activeSessions.set(internalState.sessionState.session.id, internalState);
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
}

interface InternalSessionState {
	sessionState: LearningSessionState<TableSession>,
	taskWindow: ExerciseTask[],
	remainingTasks: ExerciseTask[],
	tasksDone: ExerciseTask[],
}
