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

import {Injectable} from '@angular/core';
import {Deck} from "../models/Deck";
import {Table} from "../models/Table";
import {NavigationControlService} from "./navigation-control.service";
import {Subject, Subscribable} from "rxjs";
import {DeckService} from "./deck.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.07
 */
@Injectable({
	providedIn: 'root'
})
export class SidebarService {

	private readonly _activeDeck$ = new Subject();
	private readonly _activeTable$ = new Subject();

	readonly activeDeck: Subscribable<Deck> = this._activeDeck$;
	readonly activeTable: Subscribable<Table> = this._activeTable$;

	currentDeck: Deck;
	currentTable: Table;

	constructor(
		private readonly deckService: DeckService,
		private readonly navigationControlService: NavigationControlService) {
	}

	hide() {
		this.navigationControlService.setSidebarVisibility(false);
	}

	deselectTable() {
		this.updateTable(null);
	}

	async selectTable(table: Table) {
		this.updateTable(table);
		if (table) {
			const deck = await this.deckService.getById(table.deckId);
			this.populate(deck);
		}
	}

	populate(deck: Deck) {
		const deckIsNull = deck === null || deck === undefined;
		this.navigationControlService.setSidebarVisibility(!deckIsNull);
		this.updateDeck(deck);
		if (deckIsNull) {
			this.deselectTable();
		}
	}

	private updateTable(table: Table) {
		if (this.currentTable?.id === table?.id) {
			return;
		}
		this.currentTable = table;
		this._activeTable$.next(this.currentTable);
	}

	private updateDeck(deck: Deck) {
		if (this.currentDeck?.id === deck?.id) {
			return;
		}

		this.currentDeck = deck;
		this._activeDeck$.next(this.currentDeck);
	}
}
