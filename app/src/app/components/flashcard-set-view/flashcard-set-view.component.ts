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

import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";

import {Flashcard} from "@app/models/Flashcard";
import {FlashcardSet} from "@app/models/flashcard-set";

import {SidebarService} from "@app/services/sidebar.service";
import {TopBarService} from "@app/services/top-bar.service";
import {NavigationControlService} from "@app/services/navigation-control.service";
import {NavigationService} from "@app/services/navigation.service";

import {FlashcardEditorComponent, FlashcardFields} from "@app/components/flashcard-editor/flashcard-editor.component";
import {FlashcardSetService} from "@app/services/flashcard-set.service";
import {DECK_ID_PARAM} from "@app/components/deck-view/deck-view.component";

export const FLASHCARD_SET_ID_PARAM = "flashcardSetId";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.11.22
 */
@Component({
	selector: 'app-flashcard-set-view',
	templateUrl: './flashcard-set-view.component.html',
	styleUrls: ['./flashcard-set-view.component.sass']
})
export class FlashcardSetViewComponent implements OnInit {

	@ViewChild('newCardEditor')
	newCardEditor: FlashcardEditorComponent | undefined;

	cardSet: FlashcardSet | null = null;
	cards: Flashcard[] = [];

	constructor(
		private readonly cardService: FlashcardSetService,
		private readonly sidebarService: SidebarService,
		private readonly topBarService: TopBarService,
		private readonly navigationControlService: NavigationControlService,
		private readonly navigationService: NavigationService,
		private readonly activatedRoute: ActivatedRoute) {
	}

	async ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async (params: ParamMap) => {
			const id = params.get(FLASHCARD_SET_ID_PARAM);
			const deckId = params.get(DECK_ID_PARAM);
			this.cardSet = (id && deckId)
				? await this.cardService.getById({element: id, deck: deckId})
				: null;

			if (this.cardSet) {
				await this.sidebarService.selectDeckElement(this.cardSet);
				this.cards = this.cardSet.cards;
			} else {
				await this.navigationService.goToDeckList();
			}
		});
		this.topBarService.clearItems();
		this.topBarService.setBackButtonLabel('Back to deck');
	}

	async addNewCard(fields: FlashcardFields) {
		if (!this.cardSet || !this.newCardEditor) {
			return;
		}
		const newCard = await this.cardService.addCard(fields.question, fields.answer, this.cardSet);
		this.cards.push(newCard);
		await this.newCardEditor.resetFields();
	}

	async deleteCard(card: Flashcard) {
		if (!this.cardSet) {
			return;
		}
		const index = this.cards.indexOf(card);
		this.cards.splice(index, 1);

		await this.cardService.deleteCard({card: card, set: this.cardSet});
	}

	async updateCard(card: Flashcard, fields: FlashcardFields) {
		if (!this.cardSet) {
			return;
		}
		await this.cardService.updateCard({card: card, set: this.cardSet},
			fields.question, fields.answer);
	}
}
