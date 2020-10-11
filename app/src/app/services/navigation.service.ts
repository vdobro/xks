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
import {ScoreParams,} from "../components/session-view/session-view.component";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.10
 */
@Injectable({
	providedIn: 'root'
})
export class NavigationService {

	private deck: Deck | null = null;
	private table: Table | null = null;
	private graph: Graph | null = null;
	private studySessionActive: boolean = false;

	constructor(
		private readonly deckService: DeckService,
		private readonly tableService: TableService,
		private readonly graphService: GraphService,
		private readonly sidebarService: SidebarService,
		private readonly router: Router) {
	}

	async goBack() {
		if (this.deck) {
			if (this.table || this.graph) {
				if (this.studySessionActive) {
					await this.navigateToCurrentDeckElement();
				} else {
					await this.navigateToCurrentDeck();
				}
			} else {
				await this.goHome();
			}
		} else {
			await this.goHome();
		}
	}

	async navigateToCurrentDeckElement() {
		if (this.table) {
			await this.openTable(this.table.id);
		} else if (this.graph) {
			await this.openGraph(this.graph.id);
		}
	}

	async openTable(tableId: string) {
		await this.selectTable(tableId);
		this.studySessionActive = false;
		await this.router.navigate(['/tables', tableId, 'edit']);
	}

	async studyTable(tableId: string,
					 sessionModeId: string,
					 difficultySettings: ScoreParams) {
		await this.selectTable(tableId);
		this.studySessionActive = true;
		await this.router.navigate(['/tables', tableId, 'learn', sessionModeId], {
			queryParams: difficultySettings
		});
	}

	async studyGraph(graphId: string, difficultySettings: ScoreParams) {
		await this.selectGraph(graphId);
		this.studySessionActive = true;

		await this.router.navigate(['/graphs', graphId, 'learn'], {
			queryParams: difficultySettings
		});
	}

	async openGraph(graphId: string) {
		await this.selectGraph(graphId);
		this.studySessionActive = false;
		await this.router.navigate(['/graphs', graphId, 'edit']);
	}

	async navigateToCurrentDeck() {
		if (this.deck) {
			this.table = null;
			this.graph = null;
			this.sidebarService.deselectTable();
			this.sidebarService.deselectGraph();
			await this.openDeck(this.deck.id);
		}
	}

	async openDeck(deckId: string) {
		this.studySessionActive = false;
		this.deck = await this.deckService.getById(deckId);
		this.sidebarService.populate(this.deck);
		await this.router.navigate(['/decks', deckId]);
	}

	async goHome() {
		this.studySessionActive = false;
		this.deck = null;
		this.table = null;
		await this.router.navigate(['/']);
	}

	async goToDeckList() {
		this.studySessionActive = false;
		this.deck = null;
		this.table = null;
		this.sidebarService.depopulate();
		await this.router.navigate(['/decks']);
	}

	private async selectTable(tableId: string) {
		this.table = await this.tableService.getById(tableId);
		await this.sidebarService.selectTable(this.table);
	}

	private async selectGraph(graphId: string) {
		this.graph = await this.graphService.getById(graphId);
		await this.sidebarService.selectGraph(this.graph);
	}
}
