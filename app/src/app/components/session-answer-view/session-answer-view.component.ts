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

import UIkit from 'uikit';

import {
	AfterContentInit,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import {FlashcardField} from "../../services/exercise-task.service";
import {TableSessionService} from "../../services/table-session.service";
import {FormControl} from "@angular/forms";
import {LearningSessionState, StudySessionService} from "../../services/study-session.service";
import {GraphSessionService} from "../../services/graph-session.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.07
 */
@Component({
	selector: 'app-session-answer-view',
	templateUrl: './session-answer-view.component.html',
	styleUrls: ['./session-answer-view.component.sass']
})
export class SessionAnswerViewComponent implements OnInit, AfterContentInit, OnChanges {

	@ViewChild('answerFieldElement', {static: true})
	answerInputElement: ElementRef;

	@Input()
	answerField: FlashcardField;

	@Input()
	graphAnswer: boolean = false;
	@Input()
	shouldGetFocus: boolean = false;
	@Input()
	allowOverride: boolean = false;

	@Input()
	state: LearningSessionState;
	@Output()
	stateChange = new EventEmitter<LearningSessionState>();

	answerInput = new FormControl('');

	answerWrong: boolean = false;
	answerCorrect: boolean = false;
	disableInput: boolean = false;

	private taskService: StudySessionService = null;

	constructor(
		private readonly tableTaskService: TableSessionService,
		private readonly graphTaskService: GraphSessionService) {
	}

	ngOnInit(): void {
		this.answerInput.setValue('');
	}

	ngOnChanges() {
		if (this.graphAnswer) {
			this.taskService = this.graphTaskService;
		} else {
			this.taskService = this.tableTaskService;
		}
		setTimeout(() => {
			const currentTask = this.state.currentTask.id;
			const previousTask = this.state.lastAnswer?.task.id;
			if (currentTask !== previousTask) {
				this.answerInput.setValue('');
				this.disableInput = false;
				this.resetAnswerCorrect();
			}
			this.focusIfNeeded();
		});
	}

	ngAfterContentInit(): void {
		setTimeout(() => this.focusIfNeeded());
	}

	async submitAnswer() {
		if (this.disableInput) {
			return;
		}
		UIkit.notification.closeAll();
		const nextState = await this.taskService.submitAnswer(
			this.answerInput.value,
			this.answerField?.identifier.id,
			this.state);
		if (nextState?.lastAnswer?.correct) {
			if (nextState.currentTask.pendingAnswerFields.length > 0) {
				this.disableInput = true;
			}
			this.setAnswerCorrect(true);
			UIkit.notification("Correct", {
				status: 'success',
				timeout: 1000,
			});
		} else {
			this.setAnswerCorrect(false);
			UIkit.notification("Incorrect, correct answer was:\n" + nextState?.lastAnswer?.expectedAnswer, {
				status: 'danger',
				timeout: 1000,
			});
		}
		this.stateChange.emit(nextState);
	}

	private focusIfNeeded() {
		if (this.shouldGetFocus) {
			this.answerInputElement.nativeElement.focus();
			this.answerInput.setValue('');
		}
	}

	@HostListener('document:keypress', ['$event'])
	async handleKeyboardEvent(event: KeyboardEvent) {
		if (event.shiftKey && event.key == "F"
			&& this.answerWrong && this.allowOverride) {
			await this.forceAcceptAnswer();
		}
	}

	async forceAcceptAnswer() {
		UIkit.notification.closeAll();
		const nextState = await this.taskService.acceptLastAnswer(this.state);
		this.setAnswerCorrect(true);
		UIkit.notification("Answer accepted", {
			status: 'warning',
			timeout: 1000,
		});

		this.stateChange.emit(nextState);
	}

	private setAnswerCorrect(value: boolean) {
		this.answerCorrect = value;
		this.answerWrong = !value;
	}

	private resetAnswerCorrect() {
		this.answerCorrect = false;
		this.answerWrong = false;
	}
}
