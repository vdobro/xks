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
import {FormControl} from "@angular/forms";

import {Deck} from "../../models/Deck";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.07.12
 */
@Component({
	selector: 'app-new-deck-element-modal',
	templateUrl: './new-deck-element-modal.component.html',
	styleUrls: ['./new-deck-element-modal.component.sass']
})
export class NewDeckElementModalComponent implements OnInit {

	@ViewChild("modal")
	modal: ElementRef;

	@ViewChild("nameInputElement")
	nameInputElement: ElementRef;

	@Input()
	deck: Deck;

	@Input()
	type: String;

	nameInput = new FormControl('');

	@Output()
	nameSubmitted = new EventEmitter<string>();

	constructor() {
	}

	ngOnInit(): void {
	}

	async onSaveClick() {
		const name = this.nameInput?.value?.trim();
		if (name === null || name === '') {
			return;
		}
		this.nameSubmitted.emit(name);

		this.nameInput.reset();
		UIkit.modal(this.modal.nativeElement).hide();
	}

	openDialog() {
		UIkit.modal(this.modal.nativeElement).show();
		setTimeout(() => {
			this.nameInputElement.nativeElement.focus()
		});
		this.nameInput.setValue('');
	}
}
