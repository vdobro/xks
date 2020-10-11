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

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import UIkit from 'uikit';
import {FormControl} from "@angular/forms";
import {DeckService} from "../../services/deck.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.14
 */
@Component({
	selector: 'app-new-deck-modal',
	templateUrl: './new-deck-modal.component.html',
	styleUrls: ['./new-deck-modal.component.sass']
})
export class NewDeckModalComponent implements OnInit {

	@ViewChild("newDeckModal")
	modal: ElementRef | undefined;

	@ViewChild("deckNameInput", {static: true})
	nameInputElement: ElementRef | undefined;

	nameInput = new FormControl('');
	descriptionInput = new FormControl('');

	constructor(private readonly deckService: DeckService) {
	}

	ngOnInit(): void {
	}

	async onSaveClick() {
		const name = this.nameInput.value.trim();
		if (name === '') {
			return;
		}
		const description = this.descriptionInput.value?.trim();
		await this.deckService.create(name, description ? description : '');

		this.clearForm();
		UIkit.modal(this.modal!!.nativeElement).hide();
	}

	private clearForm() {
		this.nameInput.reset();
		this.descriptionInput.reset();
	}

	openModal() {
		if (!this.modal) {
			return;
		}
		UIkit.modal(this.modal.nativeElement).show();
		setTimeout(() => {
			this.nameInputElement?.nativeElement.focus()
		});
		this.nameInput.setValue('');
	}
}
