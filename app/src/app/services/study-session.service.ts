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

import {ExerciseTask} from "@app/services/models/exercise-task";
import {AnswerFeedback} from "@app/services/models/answer-feedback";
import {LearningSession} from "@app/services/models/learning-session";
import {LearningSessionState} from "@app/services/models/learning-session-state";

import {ExerciseTaskService} from "@app/services/exercise-task.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.15
 */
export class StudySessionService {
	private readonly defaultTaskWindowSize: number = 10;

	private readonly activeSessions = new Map<string, InternalSessionState>();

	constructor(protected readonly taskService: ExerciseTaskService) {
	}

	submitAnswer(answer: string,
				 fieldId: string,
				 state: LearningSessionState): LearningSessionState {

		const answerFeedback = this.taskService.logInAnswer(answer, fieldId,
			state.currentTask, state.lastAnswer?.fieldId || null);
		return this.handleAnswerFeedback(answerFeedback.actualField.identifier.id,
			answerFeedback, state);
	}

	acceptLastAnswer(currentValue: string,
					 state: LearningSessionState): LearningSessionState {

		if (!state.lastAnswer) {
			return state;
		}
		const fieldId = state.lastAnswer.fieldId;
		const lastTask = state.lastAnswer.task;
		const answerFeedback = this.taskService.forceAcceptAnswer(currentValue, fieldId, lastTask);
		return this.handleAnswerFeedback(fieldId, answerFeedback, state);
	}

	public cleanup(): void {
		this.taskService.resetTasks();
	}

	protected createSessionFromTasks(allTasks: ExerciseTask[]): LearningSessionState {

		const session: LearningSession = StudySessionService.createSession();
		const actualInitialWindowSize = Math.min(allTasks.length, this.defaultTaskWindowSize);
		const initialWindow = allTasks.slice(0, actualInitialWindowSize);
		const remainingTasks = allTasks.slice(actualInitialWindowSize);
		const state: LearningSessionState = {
			currentTask: StudySessionService.randomElement(initialWindow),
			session: session,
			progress: 0,
			lastAnswer: null,
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

	private removeAnswerFieldFromPending(answerFeedback: AnswerFeedback, state: LearningSessionState): void {
		if (!answerFeedback.correct) {
			return;
		}
		const doneAnswer = answerFeedback.actualField;
		state.currentTask.pendingAnswers = state.currentTask.pendingAnswers
			.filter(x => x.identifier.id !== doneAnswer.identifier.id);
		state.currentTask.doneAnswers.push({
			input: answerFeedback.input,
			field: answerFeedback.actualField
		});
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
			expectedAnswer: answerFeedback.actualField.value.default, //TODO: alternative value???
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

	private checkCompletion(state: LearningSessionState): void {
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

		const allTasks = internalState.taskWindow.concat(internalState.remainingTasks, internalState.tasksDone);

		const maxScore = allTasks.map(task => (task.maxScore - task.startingScore))
			.reduce((sum, current) => sum + current, 0);

		const currentScore = allTasks
			.map(task => Math.max(0, this.taskService.getCurrentScore(task) - task.startingScore))
			.reduce((sum, current) => sum + current, 0);

		const progress = currentScore / maxScore;
		return Math.max(progress, 0);
	}

	private updateActiveTaskWindow(state: LearningSessionState): void {
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

	private removeDoneTasksFromWindow(state: LearningSessionState): void {
		const internalState = this.getInternalState(state);
		const oldWindow = this.getTaskWindow(state);
		const newWindow: ExerciseTask[] = [];
		for (const task of oldWindow) {
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

	private getInternalState(state: LearningSessionState): InternalSessionState {
		const value = this.activeSessions.get(state.session.id);
		if (value) {
			return value;
		} else {
			throw new Error('Study session internal state not defined. Try reloading the application.');
		}
	}

	private updateInternalState(internalState: InternalSessionState): void {
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
		const start: number = 0;
		const end: number = array.length - 1;
		const index: number = this.random(start, end);
		return array[index];
	}

	private static random(start: number, end: number): number {
		return Math.floor(start + (Math.random() * (end - start)));
	}
}

interface InternalSessionState {
	sessionState: LearningSessionState,
	taskWindow: ExerciseTask[],
	remainingTasks: ExerciseTask[],
	tasksDone: ExerciseTask[],
}
