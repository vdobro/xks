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

import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Deck} from "../../models/Deck";

import UIkit from 'uikit';
import {FormControl} from "@angular/forms";
import {DeckService} from "../../services/deck.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.13
 */
@Component({
	selector: 'app-new-deck-modal',
	templateUrl: './new-deck-modal.component.html',
	styleUrls: ['./new-deck-modal.component.sass']
})
export class NewDeckModalComponent implements OnInit {

	@ViewChild("newDeckModal") modal: ElementRef;
	@Output() newDeck = new EventEmitter<Deck>();

	nameInput = new FormControl('');
	descriptionInput = new FormControl('');

	constructor(private deckService: DeckService) {
	}

	ngOnInit(): void {
	}

	onSaveClick() {
		const name = this.nameInput.value.trim();
		if (name === '') {
			return;
		}
		const newDeck = this.deckService.create(name, this.descriptionInput.value);

		this.clearForm();
		UIkit.modal(this.modal.nativeElement).hide();
		this.newDeck.emit(newDeck);
	}

	private clearForm() {
		this.nameInput.reset();
		this.descriptionInput.reset();
	}
}
