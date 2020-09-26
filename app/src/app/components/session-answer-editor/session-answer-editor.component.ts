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


import {
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
import {StudySessionService} from "../../services/study-session.service";
import {GraphSessionService} from "../../services/graph-session.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.07
 */
@Component({
	selector: 'session-answer-editor',
	templateUrl: './session-answer-editor.component.html',
	styleUrls: ['./session-answer-editor.component.sass']
})
export class SessionAnswerEditorComponent implements OnInit, OnChanges {

	@ViewChild('answerFieldElement', {static: true})
	answerInputElement: ElementRef;

	@Input()
	answerField: FlashcardField;
	@Input()
	indexNumber: number;

	@Input()
	graphAnswer: boolean = false;
	@Input()
	shouldGetFocus: boolean = false;
	@Input()
	allowOverride: boolean = false;
	@Input()
	lastAnswerAccepted: boolean = true;

	@Output()
	submitted = new EventEmitter<{ field: FlashcardField, value: string, }>();
	@Output()
	forceAcceptRequest = new EventEmitter();

	answerInput = new FormControl('');

	private taskService: StudySessionService = null;

	private lastAnswer: string = '';

	constructor(
		private readonly tableTaskService: TableSessionService,
		private readonly graphTaskService: GraphSessionService) {
	}

	ngOnInit() {
		if (this.graphAnswer) {
			this.taskService = this.graphTaskService;
		} else {
			this.taskService = this.tableTaskService;
		}
		this.resetInput();
	}

	ngOnChanges() {
		this.answerInputElement.nativeElement.focus();
		this.resetInput();
	}

	async submitAnswer() {
		const value = this.answerInput.value.trim();
		this.lastAnswer = value;
		this.resetInput();
		if (value.length > 0) {
			this.submitted.emit({value: value, field: this.answerField});
		}
	}

	@HostListener('document:keypress', ['$event'])
	async handleKeyboardEvent(event: KeyboardEvent) {
		if (event.shiftKey && event.key == "Enter" && this.allowOverride) {
			await this.forceAcceptAnswer();
		}
	}

	async forceAcceptAnswer() {
		if (this.allowOverride) {
			this.forceAcceptRequest.emit(this.answerField);
			this.resetInput();
		}
	}

	private resetInput() {
		if (this.lastAnswerAccepted) {
			this.answerInput.setValue('');
		} else {
			this.answerInput.setValue(this.lastAnswer);
			this.lastAnswer = '';
		}
	}
}
