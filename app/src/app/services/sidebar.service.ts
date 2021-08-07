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
import {Graph} from "@app/models/graph";
import {Table} from "@app/models/Table";

import {NavigationControlService} from "./navigation-control.service";
import {DeckService} from "./deck.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.07
 */
@Injectable({
	providedIn: 'root'
})
export class SidebarService {

	private readonly _activeDeck$ = new Subject<Deck | null>();
	private readonly _activeTable$ = new Subject<Table | null>();
	private readonly _activeGraph$ = new Subject<Graph | null>();

	readonly activeDeck: Subscribable<Deck | null> = this._activeDeck$;
	readonly activeTable: Subscribable<Table | null> = this._activeTable$;
	readonly activeGraph: Subscribable<Graph | null> = this._activeGraph$;

	currentDeck: Deck | null = null;
	currentTable: Table | null = null;
	currentGraph: Graph | null = null;

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

	deselectGraph() {
		this.updateGraph(null);
	}

	async selectTable(table: Table) {
		this.updateTable(table);
		if (table) {
			const deck = await this.deckService.getById(table.deckId);
			this.populate(deck);
		}
	}

	async selectGraph(graph: Graph) {
		this.updateGraph(graph);
		if (graph) {
			const deck = await this.deckService.getById(graph.deckId);
			this.populate(deck);
		}
	}

	depopulate() {
		this.navigationControlService.setSidebarVisibility(false);
		this.updateDeck(null);
		this.deselectTable();
		this.deselectGraph();
	}

	populate(deck: Deck) {
		this.navigationControlService.setSidebarVisibility(true);
		this.updateDeck(deck);
	}

	private updateTable(table: Table | null): void {
		if (this.currentTable?.id === table?.id) {
			return;
		}
		this.currentTable = table;
		this._activeTable$.next(this.currentTable);
	}

	private updateDeck(deck: Deck | null): void {
		if (this.currentDeck?.id === deck?.id) {
			return;
		}

		this.currentDeck = deck;
		this._activeDeck$.next(this.currentDeck);
	}

	private updateGraph(graph: Graph | null) {
		if (this.currentGraph?.id === graph?.id) {
			return;
		}
		this.currentGraph = graph;
		this._activeGraph$.next(this.currentGraph);
	}
}
