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

import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";

import {Deck} from "@app/models/Deck";

import {GraphService} from "@app/services/graph.service";
import {TableService} from "@app/services/table.service";
import {FlashcardSetService} from "@app/services/flashcard-set.service";

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
	modal: ElementRef | undefined;

	@ViewChild("nameInputElement")
	nameInputElement: ElementRef | undefined;

	@Input()
	deck: Deck | null = null;

	type: DeckElementType = DeckElementType.TABLE;

	nameInput = new FormControl('');

	constructor(
		private readonly graphService: GraphService,
		private readonly tableService: TableService,
		private readonly flashcardSetService: FlashcardSetService,
	) {
	}

	ngOnInit(): void {
	}

	async onSaveClick() {
		const name = this.nameInput?.value?.trim();
		if (name === null || name === '') {
			return;
		}
		await this.createElement(name);

		this.nameInput.reset();
		UIkit.modal(this.modal!.nativeElement).hide();
	}

	openDialog() {
		if (!this.modal) {
			return;
		}
		UIkit.modal(this.modal.nativeElement).show();

		setTimeout(() => {
			this.nameInputElement?.nativeElement.focus()
		});
		this.nameInput.setValue('');
	}

	private async createElement(name: string) {
		if (!this.deck) {
			return;
		}
		switch (this.type) {
			case DeckElementType.GRAPH:
				await this.graphService.create(this.deck, name);
				break;
			case DeckElementType.TABLE:
				await this.tableService.create(this.deck, name);
				break;
			case DeckElementType.FLASHCARDS:
				await this.flashcardSetService.create(this.deck, name);
				break;
			default:
				break;
		}
	}

	selectTypeGraph() {
		this.type = DeckElementType.GRAPH;
	}

	selectTypeTable() {
		this.type = DeckElementType.TABLE;
	}

	selectTypeFlashcards() {
		this.type = DeckElementType.FLASHCARDS;
	}
}

export enum DeckElementType {
	GRAPH = 'graph',
	TABLE = 'table',
	FLASHCARDS = 'flashcard list',
}
