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

import {Component, OnInit} from '@angular/core';

import {FlashcardSet} from "@app/models/flashcard-set";

import {NavigationService} from "@app/services/navigation.service";
import {FlashcardSetService} from "@app/services/flashcard-set.service";

import {SidebarDeckElement, SidebarDeckElementComponent} from "@app/components/sidebar-deck-element/sidebar-deck-element.component";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.11.21
 */
@Component({
	selector: 'li [deck-element-flashcard-set]',
	templateUrl: './sidebar-deck-element.component.html',
	styleUrls: ['./sidebar-deck-element.component.sass']
})
export class SidebarFlashcardSetListElementComponent
	extends SidebarDeckElementComponent
	implements OnInit {

	private cards: FlashcardSet | null = null;

	constructor(private readonly flashcardSetService: FlashcardSetService,
				private readonly navigationService: NavigationService) {
		super();

		this.elementType = 'flashcard collection';

		this.flashcardSetService.setChanged.subscribe(async (set: FlashcardSet) => {
			if (this.element?.id === set.id) {
				await this.updateElementCount(set);
			}
		});
	}

	async ngOnInit(): Promise<void> {
		await super.ngOnInit();

		if (this.element) {
			this.cards = this.element as FlashcardSet;
			await this.updateElementCount(this.cards);
		}
	}

	private async updateElementCount(set: FlashcardSet) {
		if (!this.deck || !this.element) {
			return;
		}
		this.cards = this.element as FlashcardSet;
		this.elementCount = set.cards.length;
	}

	protected async onClickHandler(id: string) {
		if (!this.deck) {
			return;
		}
		await this.navigationService.openFlashcardSet({element: id, deck: this.deck.id});
	}

	protected async onDeleteHandler(id: string) {
		if (!this.deck) {
			return;
		}
		await this.flashcardSetService.delete({element: id, deck: this.deck.id});
	}

	protected async onUpdateHandler(element: SidebarDeckElement) {
		await this.flashcardSetService.update(element as FlashcardSet);
	}
}
