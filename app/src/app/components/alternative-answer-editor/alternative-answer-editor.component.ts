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

import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormArray, FormControl} from "@angular/forms";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.10.21
 */
@Component({
	selector: 'app-alternative-answer-editor',
	templateUrl: './alternative-answer-editor.component.html',
	styleUrls: ['./alternative-answer-editor.component.sass']
})
export class AlternativeAnswerEditorComponent implements OnInit {

	@ViewChild('answerEditorModal')
	modal: ElementRef | undefined;

	@ViewChild('formElement')
	form: ElementRef | undefined;

	@Input()
	existingValues: string[] = [];

	@Output()
	valuesChanged = new EventEmitter<string[]>();
	@Output()
	closed = new EventEmitter();

	inputs = new FormArray([]);
	handlerInitialized: boolean = false;

	constructor() {
	}

	ngOnInit(): void {
		for (let existingValue of this.existingValues) {
			const control = new FormControl('');
			this.inputs.push(control);
			control.setValue(existingValue);
		}
	}

	openModal() {
		if (this.modal) {
			UIkit.modal(this.modal.nativeElement).show();
			this.initializeCloseHandler();
		}
	}

	onSubmit() {
		if (this.modal && this.form) {
			UIkit.modal(this.modal.nativeElement).hide();
			this.valuesChanged.emit(this.inputs.value as string[]);
		}
	}

	onAddValueClick() {
		this.inputs.push(new FormControl(''));
	}

	private initializeCloseHandler() {
		if (this.handlerInitialized) {
			return;
		}
		this.handlerInitialized = true;

		// @ts-ignore
		UIkit.util.on(this.modal.nativeElement, 'hidden', _ => {
			this.closed.emit();
		});
	}
}
