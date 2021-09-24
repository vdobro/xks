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
import {Router} from '@angular/router';

import {Deck} from "@app/models/Deck";
import {Graph} from "@app/models/graph";
import {Table} from "@app/models/Table";
import {ElementId} from "@app/models/ElementId";
import {DeckElement} from "@app/models/DeckElement";

import {DeckService} from "@app/services/deck.service";
import {TableService} from "@app/services/table.service";
import {SidebarService} from "@app/services/sidebar.service";
import {GraphService} from "@app/services/graph.service";

import {ScoreParams,} from "@app/components/session-view/session-view.component";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.10
 */
@Injectable({
	providedIn: 'root'
})
export class NavigationService {

	private deck: Deck | null = null;
	private deckElement: DeckElement | null = null;
	private studySessionActive: boolean = false;

	constructor(
		private readonly deckService: DeckService,
		private readonly tableService: TableService,
		private readonly graphService: GraphService,
		private readonly flashcardSetService: FlashcardSetService,
		private readonly sidebarService: SidebarService,
		private readonly router: Router) {
	}

	async goBack() {
		if (!this.deck || !this.deckElement) {
			await this.goHome();
			return;
		}
		if (this.studySessionActive) {
			await this.navigateToCurrentDeckElement();
		} else {
			await this.navigateToCurrentDeck();
		}
	}

	async navigateToCurrentDeckElement() {
		if (!this.deck) {
			return;
		}
		const deckId = this.deck.id;
		if (ElementTypeUtilities.isTable(this.deckElement)) {
			await this.openTable({element: this.deckElement.id, deck: deckId});
		} else if (ElementTypeUtilities.isGraph(this.deckElement)) {
			await this.openGraph({element: this.deckElement.id, deck: deckId});
		}
	}

	async openTable(id: ElementId) {
		await this.selectTable(id);
		this.studySessionActive = false;
		await this.router.navigate(['/decks', id.deck, 'tables', id.element, 'edit']);
	}

	async studyTable(table: DeckElement,
					 sessionModeId: string,
					 difficultySettings: ScoreParams) {
		const id: ElementId = {element: table.id, deck: table.deckId};
		await this.selectTable(id);
		this.studySessionActive = true;
		await this.router.navigate(['/decks', id.deck, 'tables', id.element, 'learn', sessionModeId], {
			queryParams: difficultySettings
		});
	}

	async studyGraph(graph: DeckElement, difficultySettings: ScoreParams) {
		const id: ElementId = {element: graph.id, deck: graph.deckId};
		await this.selectGraph(id);
		this.studySessionActive = true;

		await this.router.navigate(['/decks', id.deck, 'graphs', id.element, 'learn'], {
			queryParams: difficultySettings
		});
	}

	async openGraph(id: ElementId) {
		await this.selectGraph(id);
		this.studySessionActive = false;
		await this.router.navigate(['/decks', id.deck, 'graphs', id.element, 'edit']);
	}

	async navigateToCurrentDeck() {
		if (this.deck) {
			this.deckElement = null;
			this.sidebarService.deselectDeckElement();
			await this.openDeck(this.deck.id);
		}
	}

	async openDeck(id: string) {
		this.studySessionActive = false;
		this.deck = await this.deckService.getById(id);
		this.sidebarService.populate(this.deck);
		await this.router.navigate(['/decks', id]);
	}

	async goHome() {
		this.studySessionActive = false;
		this.deck = null;
		this.deckElement = null;
		await this.router.navigate(['/']);
	}

	async goToDeckList() {
		this.studySessionActive = false;
		this.deck = null;
		this.deckElement = null;
		this.sidebarService.depopulate();
		await this.router.navigate(['/decks']);
	}

	private async selectTable(tableId: ElementId) {
		this.table = await this.tableService.getById(tableId);
		await this.sidebarService.selectTable(this.table);
	}

	private async selectGraph(graphId: ElementId) {
		this.graph = await this.graphService.getById(graphId);
		await this.sidebarService.selectGraph(this.graph);
	}
}
