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

import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";

import {Deck} from "@app/models/deck";

import {DeckService} from "@app/services/deck.service";
import {NavigationService} from "@app/services/navigation.service";

@Component({
	selector: 'app-deck-list-card',
	templateUrl: './deck-list-card.component.html',
	styleUrls: ['./deck-list-card.component.sass']
})
export class DeckListCardComponent implements OnInit {

	@Input()
	public deck: Deck | null = null;

	public editMode: boolean = false;

	@ViewChild('nameInputControl', {static: false})
	nameInputControl: ElementRef | undefined;

	public readonly nameInput: FormControl<string> = new FormControl<string>('', { nonNullable: true });
	public readonly descriptionInput: FormControl<string> = new FormControl<string>('', { nonNullable: true });

	constructor(private readonly deckService: DeckService,
				private readonly navigationService: NavigationService) {
	}

	public ngOnInit(): void {
		this.nameInput.setValue(this.deck?.name ?? '');
		this.descriptionInput.setValue(this.deck?.description ?? '');
	}

	public onEditClicked(): void {
		this.editMode = true;

		setTimeout((): void => {
			this.nameInputControl?.nativeElement.focus();
		});
	}

	async onChangesSubmit(): Promise<void> {
		const title: string = this.nameInput.value.trim();
		if (!title || !this.deck) {
			return;
		}
		this.deck.name = title;
		this.deck.description = this.descriptionInput.value.trim();
		this.editMode = false;

		await this.deckService.update(this.deck);
	}

	async openDeckDetails(): Promise<void> {
		if (!this.editMode) {
			await this.navigationService.openDeck(this.deck!.id);
		}
	}
}
