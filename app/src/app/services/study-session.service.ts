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
import {AnswerFeedback, ExerciseTask, ExerciseTaskService} from "./exercise-task.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.15
 */
export class StudySessionService {
	private readonly defaultTaskWindowSize = 10;

	private readonly activeSessions = new Map<string, InternalSessionState>();

	constructor(protected readonly taskService: ExerciseTaskService) {
	}

	submitAnswer(answer: string,
				 fieldId: string,
				 state: LearningSessionState): LearningSessionState {
		const answerFeedback = this.taskService.logInAnswer(answer, fieldId,
			state.currentTask, state.lastAnswer?.fieldId);
		return this.handleAnswerFeedback(answerFeedback.actualField.identifier.id,
			answerFeedback, state);
	}

	acceptLastAnswer(state: LearningSessionState): LearningSessionState {
		const fieldId = state.lastAnswer.fieldId;
		const lastTask = state.lastAnswer.task;
		const answerFeedback = this.taskService.forceAcceptAnswer(fieldId, lastTask);
		return this.handleAnswerFeedback(fieldId, answerFeedback, state);
	}

	cleanup() {
		this.taskService.resetTasks();
	}

	protected createSessionFromTasks(allTasks: ExerciseTask[]) {
		const session: LearningSession = StudySessionService.createSession();
		const actualInitialWindowSize = Math.min(allTasks.length, this.defaultTaskWindowSize);
		const initialWindow = allTasks.slice(0, actualInitialWindowSize);
		const remainingTasks = allTasks.slice(actualInitialWindowSize);
		const state: LearningSessionState = {
			currentTask: StudySessionService.randomElement(initialWindow),
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

	private removeAnswerFieldFromPending(answerFeedback: AnswerFeedback, state: LearningSessionState) {
		if (!answerFeedback.correct) {
			return;
		}
		const doneAnswer = answerFeedback.actualField;
		state.currentTask.pendingAnswers = state.currentTask.pendingAnswers
			.filter(x => x.identifier.id !== doneAnswer.identifier.id);
		state.currentTask.doneAnswers.push(doneAnswer);
	}

	private handleAnswerFeedback(fieldId: string,
								 answerFeedback: AnswerFeedback,
								 state: LearningSessionState): LearningSessionState {
		this.removeAnswerFieldFromPending(answerFeedback, state);
		this.updateActiveTaskWindow(state);
		const allFieldsSubmitted = state.currentTask.pendingAnswers.length === 0;

		const lastColumnAndTaskEqual = (fieldId === state.lastAnswer?.fieldId
			&& state.lastAnswer?.task.id === state.currentTask.id);

		state.lastAnswer = {
			correct: answerFeedback.correct,
			expectedAnswer: answerFeedback.actualField.value,
			task: state.currentTask,
			fieldId: fieldId
		};

		if (allFieldsSubmitted && (answerFeedback.correct || lastColumnAndTaskEqual)) {
			state.currentTask.pendingAnswers = state.currentTask.answers;
			state.currentTask.doneAnswers = [];
			state.currentTask = this.chooseNextLowestTask(state);
		}
		state.progress = this.calculateProgress(state);
		this.checkCompletion(state);
		return state;
	}

	private checkCompletion(state: LearningSessionState) {
		const internalState = this.getInternalState(state);
		if (internalState.remainingTasks.length === 0
			&& internalState.taskWindow.every(task => this.taskService.isComplete(task))) {
			state.session.end = new Date();
			state.session.complete = true;
		}
	}

	private chooseNextLowestTask(state: LearningSessionState): ExerciseTask {
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
		return StudySessionService.randomElement(lowestTasks).task;
	}

	private calculateProgress(state: LearningSessionState): number {
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

	private updateActiveTaskWindow(state: LearningSessionState) {
		const defaultWindowSize = this.getTaskWindow(state).length;
		this.removeDoneTasksFromWindow(state);

		while (this.getTaskWindow(state).length < defaultWindowSize) {
			const internalState = this.getInternalState(state);
			const selectedTask = StudySessionService.selectNewTaskFromAvailable(internalState);

			if (!selectedTask) {
				return;
			}
			internalState.taskWindow.push(selectedTask);
			internalState.remainingTasks = internalState.remainingTasks.filter(task =>
				task.id !== selectedTask.id);
		}
	}

	private removeDoneTasksFromWindow(state: LearningSessionState) {
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

	private getTaskWindow(state: LearningSessionState): ExerciseTask[] {
		return this.getInternalState(state).taskWindow;
	}

	private getInternalState(state: LearningSessionState) {
		return this.activeSessions.get(state.session.id);
	}

	private updateInternalState(internalState: InternalSessionState) {
		this.activeSessions.set(internalState.sessionState.session.id, internalState);
	}

	private static selectNewTaskFromAvailable(internalState: InternalSessionState): ExerciseTask | null {
		const remainingTasks = internalState.remainingTasks;
		const doneTasks = internalState.tasksDone;

		if (remainingTasks.length > 0) {
			return StudySessionService.randomElement(remainingTasks);
		} else if (doneTasks.length > 0) {
			const newTask = StudySessionService.randomElement(doneTasks);
			doneTasks.splice(doneTasks.indexOf(newTask), 1);
			return newTask;
		} else return null;
	}

	private static createSession(): LearningSession {
		return {
			start: new Date(),
			end: null,
			complete: false,
			id: uuid(),
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
	start: Date,
	end: Date
	id: string,
	complete: boolean,
}

export interface LearningSessionState {
	session: LearningSession,
	currentTask: ExerciseTask,
	progress: number,
	lastAnswer: {
		correct: boolean,
		expectedAnswer: string,
		fieldId: string,
		task: ExerciseTask
	}
}

interface InternalSessionState {
	sessionState: LearningSessionState,
	taskWindow: ExerciseTask[],
	remainingTasks: ExerciseTask[],
	tasksDone: ExerciseTask[],
}
