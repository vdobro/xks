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

import {Deck} from "@app/models/deck";
import {ElementId} from "@app/models/element-id";
import {DeckElement, DeckElementType, getId} from "@app/models/deck-element";
import {isTable, Table} from "@app/models/table";
import {Graph, isGraph} from "@app/models/graph";
import {FlashcardSet, isFlashcardList} from "@app/models/flashcard-set";

import {DeckService} from "@app/services/deck.service";
import {TableService} from "@app/services/table.service";
import {SidebarService} from "@app/services/sidebar.service";
import {GraphService} from "@app/services/graph.service";

import {ScoreParams} from "@app/components/session-view/session-view.component";
import {FlashcardSetService} from "@app/services/flashcard-set.service";

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
		private readonly flashcardService: FlashcardSetService,
		private readonly sidebarService: SidebarService,
		private readonly router: Router) {
	}

	async goBack(): Promise<void> {
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

	async navigateToCurrentDeckElement(): Promise<void> {
		if (!this.deck) {
			return;
		}
		const deckId = this.deck.id;
		if (isTable(this.deckElement)) {
			await this.openTable({element: this.deckElement.id, deck: deckId});
		} else if (isGraph(this.deckElement)) {
			await this.openGraph({element: this.deckElement.id, deck: deckId});
		} else if (isFlashcardList(this.deckElement)) {
			await this.openFlashcardSet({element: this.deckElement.id, deck: deckId});
		}
	}
	async openTable(id: ElementId): Promise<void> {
		await this.selectTable(id);
		this.studySessionActive = false;
		await this.router.navigate(['/decks', id.deck, 'tables', id.element, 'edit']);
	}

	async openGraph(id: ElementId): Promise<void> {
		await this.selectGraph(id);
		this.studySessionActive = false;
		await this.router.navigate(['/decks', id.deck, 'graphs', id.element, 'edit']);
	}

	async openFlashcardSet(id: ElementId): Promise<void> {
		await this.selectFlashcardList(id);
		this.studySessionActive = false;
		await this.router.navigate(['/decks', id.deck, 'cards', id.element, 'edit']);
	}

	async studyTable(table: Table,
					 sessionModeId: string,
					 difficultySettings: ScoreParams): Promise<void> {

		const id = getId(table);
		await this.selectTable(id);
		this.studySessionActive = true;

		await this.router.navigate(['/decks', id.deck, 'tables', id.element, 'learn', sessionModeId], {
			queryParams: difficultySettings
		});
	}

	async studyGraph(graph: Graph, difficultySettings: ScoreParams): Promise<void> {
		const id = getId(graph);
		await this.selectGraph(id);
		this.studySessionActive = true;

		await this.router.navigate(['/decks', id.deck, 'graphs', id.element, 'learn'], {
			queryParams: difficultySettings
		});
	}

	async studyFlashcards(flashcards: FlashcardSet, difficultySettings: ScoreParams): Promise<void> {
		const id = getId(flashcards);
		await this.selectFlashcardList(id);
		this.studySessionActive = true;

		await this.router.navigate(['/decks', id.deck, 'cards', id.element, 'learn'], {
			queryParams: difficultySettings
		});
	}

	async navigateToCurrentDeck(): Promise<void> {
		if (this.deck) {
			this.deckElement = null;
			this.sidebarService.deselectDeckElement();
			await this.openDeck(this.deck.id);
		}
	}

	async openDeck(id: string): Promise<void> {
		this.studySessionActive = false;
		this.deck = await this.deckService.getById(id);
		this.sidebarService.populate(this.deck);
		await this.router.navigate(['/decks', id]);
	}

	async goHome(): Promise<void> {
		this.studySessionActive = false;
		this.deck = null;
		this.deckElement = null;
		await this.router.navigate(['/']);
	}

	async goToDeckList(): Promise<void> {
		this.studySessionActive = false;
		this.deck = null;
		this.deckElement = null;
		this.sidebarService.depopulate();
		await this.router.navigate(['/decks']);
	}

	private async selectTable(id: ElementId): Promise<void> {
		await this.selectDeckElement(id, "table");
	}

	private async selectGraph(id: ElementId): Promise<void> {
		await this.selectDeckElement(id, "graph");
	}

	private async selectFlashcardList(id: ElementId): Promise<void> {
		await this.selectDeckElement(id, "flashcards");
	}

	private async selectDeckElement(id: ElementId, type: DeckElementType): Promise<void> {
		switch (type) {
			case "graph":
				this.deckElement = await this.graphService.getById(id);
				break;
			case "table":
				this.deckElement = await this.tableService.getById(id);
				break;
			case "flashcards":
				this.deckElement = await this.flashcardService.getById(id);
				break;
		}
		await this.sidebarService.selectDeckElement(this.deckElement);
	}
}
