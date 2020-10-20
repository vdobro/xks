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

import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {FlashcardField} from "../../services/models/flashcard-field";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.15
 */
@Component({
	selector: 'session-answer-view',
	templateUrl: './session-answer-view.component.html',
	styleUrls: ['./session-answer-view.component.sass']
})
export class SessionAnswerViewComponent implements OnInit {

	@Input()
	answerInput: string  = '';

	@Input()
	field: FlashcardField | null = null;

	@Input()
	indexNumber: number = 0;

	@Input()
	pending: boolean = false;

	control = new FormControl('');

	constructor() {
	}

	ngOnInit(): void {
		if (!this.pending && this.field !== null) {
			const isAlternative = this.isAlternative();
			const isMainAnswer = this.answerInput === this.field.value.defaultValue;

			this.control.setValue(this.answerInput +
				(isAlternative && !isMainAnswer
					? ` (${this.field.value.defaultValue})`
					: '')
			);
		}
	}

	private isAlternative() : boolean {
		if (!this.field) {
			return false;
		}
		return this.field.value.alternatives
			.find(x => x === this.answerInput) !== undefined;
	}
}
