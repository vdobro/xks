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
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import {FlashcardField} from "../../services/exercise-task.service";
import {LearningSessionState, TableSession, TableSessionService} from "../../services/table-session.service";
import {FormControl} from "@angular/forms";

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
	shouldGetFocus: boolean = false;

	@Input()
	state: LearningSessionState<TableSession>;
	@Output()
	stateChange = new EventEmitter<LearningSessionState<TableSession>>();

	answerInput = new FormControl('');

	answerWrong: boolean = false;
	answerCorrect: boolean = false;

	constructor(
		private readonly cdr: ChangeDetectorRef,
		private readonly taskService: TableSessionService) {
	}

	ngOnInit(): void {
		this.answerInput.setValue('');
	}

	ngOnChanges() {
		setTimeout(() => {
			if (this.state.taskChanged) {
				this.answerInput.setValue('');
				this.answerCorrect = false;
				this.answerWrong = false;
			}
			this.focusIfNeeded();
		});
	}

	ngAfterContentInit(): void {
		setTimeout(() => this.focusIfNeeded());
	}

	async submitAnswer() {
		UIkit.notification.closeAll();
		const nextState = await this.taskService.submitAnswer(
			this.answerInput.value,
			this.answerField.column.id,
			this.state);
		if (nextState?.lastAnswerCorrect) {
			this.answerCorrect = true;
			UIkit.notification("Correct", {
				status: 'success',
				timeout: 1000,
			});
		} else {
			this.answerWrong = true;
			UIkit.notification("Incorrect, correct answer was: \n" + nextState?.lastAnswerValue, {
				status: 'danger',
				timeout: 1000,
			});
		}
		this.stateChange.emit(nextState);
	}

	private focusIfNeeded() {
		if (this.shouldGetFocus) {
			this.answerInputElement.nativeElement.focus();
		}
	}
}
