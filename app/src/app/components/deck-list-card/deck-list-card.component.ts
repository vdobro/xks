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
import {Deck} from "../../models/Deck";
import {FormControl} from "@angular/forms";
import {DeckService} from "../../services/deck.service";
import {NavigationService} from "../../services/navigation.service";

@Component({
	selector: 'app-deck-list-card',
	templateUrl: './deck-list-card.component.html',
	styleUrls: ['./deck-list-card.component.sass']
})
export class DeckListCardComponent implements OnInit {

	@Input()
	deck: Deck;

	editMode: boolean = false;

	nameInput = new FormControl('');
	descriptionInput = new FormControl('');

	constructor(private readonly deckService: DeckService,
				private readonly navigationService: NavigationService) {
	}

	ngOnInit(): void {
		this.nameInput.setValue(this.deck?.name);
		this.descriptionInput.setValue(this.deck?.description);
	}

	onEditClicked() {
		this.editMode = true;
	}

	async onChangesSubmit() {
		this.deck.name = this.nameInput.value;
		this.deck.description = this.descriptionInput.value;
		this.editMode = false;

		await this.deckService.update(this.deck);
	}

	async openDeckDetails() {
		await this.navigationService.openDeck(this.deck.id);
	}
}
