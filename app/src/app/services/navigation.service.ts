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
import {Router} from "@angular/router";
import {Deck} from "../models/Deck";
import {Table} from "../models/Table";
import {DeckService} from "./deck.service";
import {TableService} from "./table.service";
import {NavigationControlService} from "./navigation-control.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.10
 */
@Injectable({
	providedIn: 'root'
})
export class NavigationService {

	private deck: Deck;
	private table: Table;

	constructor(
		private readonly deckService: DeckService,
		private readonly tableService: TableService,
		private readonly navigationControlService: NavigationControlService,
		private readonly router: Router) {
	}

	async navigateToCurrentTable() {
		if (this.table) {
			await this.openTable(this.table.id);
		}
	}

	async openTable(tableId: string) {
		this.table = await this.tableService.getById(tableId);
		await this.navigationControlService.selectTable(this.table);
		await this.router.navigate(['/tables', tableId]);
	}

	async navigateToCurrentDeck() {
		if (this.deck) {
			this.table = null;
			this.navigationControlService.deselectTable();
			await this.openDeck(this.deck.id);
		}
	}

	async openDeck(deckId: string) {
		this.deck = await this.deckService.getById(deckId);
		await this.navigationControlService.populateSidebar(this.deck);
		await this.router.navigate(['/decks', deckId]);
	}

	async goHome() {
		this.deck = null;
		this.table = null;
		await this.router.navigate(['/']);
	}

	async goToDeckList() {
		this.deck = null;
		this.table = null;
		await this.navigationControlService.populateSidebar(null);
		await this.router.navigate(['/decks']);
	}
}
