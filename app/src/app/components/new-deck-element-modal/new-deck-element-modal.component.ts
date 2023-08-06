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

import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";

import {Deck} from "@app/models/deck";

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
export class NewDeckElementModalComponent implements AfterViewInit {

	@ViewChild("modal")
	public modal: ElementRef | undefined;

	@ViewChild("nameInputElement", {static: true})
	public nameInputElement: ElementRef | undefined;

	@Input()
	public deck: Deck | null = null;

	public type: DeckElementType = DeckElementType.TABLE;

	public readonly nameInput: FormControl<string> = new FormControl('', { nonNullable: true });

	constructor(
		private readonly graphService: GraphService,
		private readonly tableService: TableService,
		private readonly flashcardSetService: FlashcardSetService,
	) {
	}

	public ngAfterViewInit(): void {
		if (this.modal) {
			// @ts-ignore
			UIkit.util.on(this.modal.nativeElement, 'shown', _ => {
				this.nameInputElement?.nativeElement.focus();
			});
		}
	}

	async onSaveClick(): Promise<void> {
		const name: string = this.nameInput?.value?.trim();
		if (name === null || name === '') {
			return;
		}
		await this.createElement(name);

		this.nameInput.reset();
		UIkit.modal(this.modal!.nativeElement).hide();
	}

	public openDialog(): void {
		if (!this.modal) {
			return;
		}
		UIkit.modal(this.modal.nativeElement).show();
		this.nameInput.setValue('');
	}

	private async createElement(name: string): Promise<void> {
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
		}
	}

	public selectTypeGraph(): void {
		this.type = DeckElementType.GRAPH;
	}

	public selectTypeTable(): void {
		this.type = DeckElementType.TABLE;
	}

	public selectTypeFlashcards(): void {
		this.type = DeckElementType.FLASHCARDS;
	}
}

const enum DeckElementType {
	GRAPH = 'graph',
	TABLE = 'table',
	FLASHCARDS = 'flashcard list',
}
