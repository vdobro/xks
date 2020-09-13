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
import {SidebarService} from "./sidebar.service";
import {Graph} from "../models/Graph";
import {GraphService} from "./graph.service";

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
	private graph: Graph;

	constructor(
		private readonly deckService: DeckService,
		private readonly tableService: TableService,
		private readonly graphService: GraphService,
		private readonly sidebarService: SidebarService,
		private readonly router: Router) {
	}

	async navigateToCurrentTable() {
		if (this.table) {
			await this.openTable(this.table.id);
		}
	}

	async openTable(tableId: string) {
		this.table = await this.tableService.getById(tableId);
		await this.sidebarService.selectTable(this.table);
		await this.router.navigate(['/tables', tableId, 'edit']);
	}

	async studyTable(tableId: string, sessionModeId: string) {
		this.table = await this.tableService.getById(tableId);
		await this.sidebarService.selectTable(this.table);
		await this.router.navigate(['/tables', tableId, 'learn', sessionModeId]);
	}

	async openGraph(graphId: string) {
		this.graph = await this.graphService.getById(graphId);
		await this.sidebarService.selectGraph(this.graph);
		await this.router.navigate(['/graphs', graphId, 'edit']);
	}

	async navigateToCurrentDeck() {
		if (this.deck) {
			this.table = null;
			this.sidebarService.deselectTable();
			this.sidebarService.deselectGraph();
			await this.openDeck(this.deck.id);
		}
	}

	async openDeck(deckId: string) {
		this.deck = await this.deckService.getById(deckId);
		await this.sidebarService.populate(this.deck);
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
		await this.sidebarService.populate(null);
		await this.router.navigate(['/decks']);
	}
}
