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
import {Observable, Subject} from "rxjs";

import {Component, ElementRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";

import {Flashcard} from "@app/models/flashcard";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.12.03
 */
@Component({
	selector: 'app-flashcard-editor',
	templateUrl: './flashcard-editor.component.html',
	styleUrls: ['./flashcard-editor.component.sass']
})
export class FlashcardEditorComponent implements OnInit {

	@ViewChild('questionInput', {static: true})
	questionInputControl: ElementRef | undefined;

	@ViewChild('answerInput', {static: true})
	answerInputControl: ElementRef | undefined;

	@Input()
	flashcard: Flashcard | null = null;

	question: string = '';
	answer: string = '';

	questionFormControl: FormControl<string> = new FormControl('', { nonNullable: true });
	answerFormControl: FormControl<string> = new FormControl('', { nonNullable: true });

	private readonly _valuesChanged = new Subject<FlashcardFields>();
	private readonly _deleted = new Subject<void>();

	@Output()
	readonly valueChanged: Observable<FlashcardFields> = this._valuesChanged;

	@Output()
	readonly deleted: Observable<void> = this._deleted;

	constructor() {
	}

	public ngOnInit(): void {
		this.resetFields();
	}

	resetFields(): void {
		if (this.flashcard) {
			this.question = this.flashcard.question;
			const answerValue = this.flashcard.value;
			this.answer = answerValue.default;
		} else {
			this.question = '';
			this.answer = '';
		}
		this.reloadValues();
	}

	submitValues() {
		const questionValue = this.questionFormControl.value;
		const answerValue = this.answerFormControl.value;
		if (questionValue.length > 0 && answerValue.length > 0) {
			this._valuesChanged.next({
				question: questionValue,
				answer: answerValue,
			});
			if (!this.flashcard) {
				this.switchFocusToQuestion();
			}
		}
	}

	private reloadValues() {
		this.questionFormControl.setValue(this.question);
		this.answerFormControl.setValue(this.answer);
	}

	switchFocusToQuestion() {
		this.questionInputControl?.nativeElement.focus();
	}

	switchFocusToAnswer() {
		this.answerInputControl?.nativeElement.focus();
	}

	requestToDelete() {
		this._deleted.next();
	}

	updateValuesIfNeeded() {
		if (this.flashcard) {
			this.submitValues();
		}
	}
}

export type FlashcardFields = {
	question: string,
	answer: string
}
