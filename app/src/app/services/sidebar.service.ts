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

import {Subject, Subscribable} from "rxjs";

import {Injectable} from '@angular/core';

import {Deck} from "@app/models/Deck";
import {DeckElement} from "@app/models/DeckElement";

import {NavigationControlService} from "@app/services/navigation-control.service";
import {DeckService} from "@app/services/deck.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.07
 */
@Injectable({
	providedIn: 'root'
})
export class SidebarService {

	private readonly _activeDeck$ = new Subject<Deck | null>();
	private readonly _activeDeckElement$ = new Subject<DeckElement | null>();

	readonly activeDeck: Subscribable<Deck | null> = this._activeDeck$;
	readonly activeElement : Subscribable<DeckElement | null> = this._activeDeckElement$;

	currentDeck: Deck | null = null;
	currentDeckElement: DeckElement | null = null;

	constructor(
		private readonly deckService: DeckService,
		private readonly navigationControlService: NavigationControlService) {
	}

	hide() {
		this.navigationControlService.setSidebarVisibility(false);
	}

	deselectDeckElement() {
		this.updateDeckElement(null);
	}

	async selectDeckElement(element: DeckElement) {
		this.updateDeckElement(element);
		if (element) {
			const deck = await this.deckService.getById(element.deckId);
			this.populate(deck);
		}
	}

	depopulate() {
		this.navigationControlService.setSidebarVisibility(false);
		this.updateDeck(null);
		this.deselectDeckElement();
	}

	populate(deck: Deck) {
		this.navigationControlService.setSidebarVisibility(true);
		this.updateDeck(deck);
	}

	private updateDeck(deck: Deck | null): void {
		if (this.currentDeck?.id === deck?.id) {
			return;
		}

		this.currentDeck = deck;
		this._activeDeck$.next(this.currentDeck);
	}

	private updateDeckElement(element: DeckElement | null) {
		if (this.currentDeckElement?.id === element?.id) {
			return;
		}
		this.currentDeckElement = element;
		this._activeDeckElement$.next(this.currentDeckElement);
	}
}
