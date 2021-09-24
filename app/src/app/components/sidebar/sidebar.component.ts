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

import UIkit from 'uikit';

import {Component, OnInit, ViewChild} from '@angular/core';

import {Deck} from "@app/models/Deck";
import {Graph} from "@app/models/graph";
import {Table} from "@app/models/Table";

import {NavigationControlService} from "@app/services/navigation-control.service";
import {TableService} from "@app/services/table.service";
import {DeckService} from "@app/services/deck.service";
import {NavigationService} from "@app/services/navigation.service";
import {SidebarService} from "@app/services/sidebar.service";
import {GraphService} from "@app/services/graph.service";
import {GraphElementService} from "@app/services/graph-element.service";

import {SessionSetupModalComponent} from "@app/components/session-setup-modal/session-setup-modal.component";
import {ConfirmDeleteElementModalComponent} from "@app/components/confirm-delete-element-modal/confirm-delete-element-modal.component";
import {NewDeckElementModalComponent} from "@app/components/new-deck-element-modal/new-deck-element-modal.component";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.07.12
 */
@Component({
	selector: 'div [app-sidebar]',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {

	@ViewChild(NewDeckElementModalComponent)
	newElementModal: NewDeckElementModalComponent | undefined;

	@ViewChild(ConfirmDeleteElementModalComponent)
	confirmDeleteDeckModal: ConfirmDeleteElementModalComponent | undefined;

	@ViewChild(SessionSetupModalComponent)
	setupSessionModal: SessionSetupModalComponent | undefined;

	deck: Deck | null = null;
	selectedDeckElement : DeckElement | null = null;

	tables: Table[] = [];
	graphs: Graph[] = [];
	flashcardSets: FlashcardSet[] = []; //TODO: everything

	active: boolean = false;

	constructor(private readonly navControlService: NavigationControlService,
				private readonly sidebarService: SidebarService,
				private readonly deckService: DeckService,
				private readonly tableService: TableService,
				private readonly graphService: GraphService,
				private readonly graphElementService: GraphElementService,
				private readonly flashcardSetService: FlashcardSetService,
				private readonly flashcardService: FlashcardService,
				private readonly navigationService: NavigationService) {
		this.navControlService.sidebarVisible.subscribe((value: boolean) => this.onVisibilityChanged(value));
		this.sidebarService.activeDeck.subscribe(async (value: Deck | null) => this.onActiveDeckChanged(value));
		this.sidebarService.activeTable.subscribe((value: Table | null) => this.onActiveTableChanged(value));
		this.sidebarService.activeGraph.subscribe((value: Graph | null) => this.onActiveGraphChanged(value));
		this.tableService.tablesChanged.subscribe((deckId: string) => this.onTablesChanged(deckId));
		this.graphService.deckGraphsChanged.subscribe((deckId: string) => this.onGraphsChanged(deckId));
		this.sidebarService.activeElement.subscribe((value: DeckElement | null) => this.onActiveDeckElementChanged(value));
		this.tableService.tablesChanged.subscribe((value: Deck) => this.onTablesChanged(value));
		this.graphService.graphsChanged.subscribe((value: Deck) => this.onGraphsChanged(value));
		this.flashcardSetService.setsChanged.subscribe((value: Deck) => this.onCardListsChanged(value));
	}

	async ngOnInit() {
		this.onActiveDeckElementChanged(this.sidebarService.currentElement);
		await this.onActiveDeckChanged(this.sidebarService.currentDeck);
		this.onVisibilityChanged(this.deck !== null);
	}

	private onVisibilityChanged(isVisible: boolean) {
		if (this.active !== isVisible) {
			this.active = isVisible;
		}
	}

	private onActiveDeckElementChanged(element: DeckElement | null) {
		if (this.selectedDeckElement?.id === element?.id) {
			return;
		}
		this.selectedDeckElement = element;
	}

	private async onActiveDeckChanged(deck: Deck | null): Promise<void> {
		if (this.deck?.id === deck?.id) {
			return;
		}
		this.deck = deck;
		if (this.deck) {
			this.tables = await this.tableService.getByDeck(this.deck);
			this.graphs = await this.graphService.getByDeck(this.deck);
			this.flashcardSets = await this.flashcardSetService.getByDeck(this.deck);
		} else {
			this.resetCurrentDeckElements();
		}
	}

	async onDeckDeleted() {
		this.resetCurrentDeckElements();
		if (!this.deck) {
			return;
		}
		await this.deckService.delete(this.deck);
		this.deck = null;
		await this.goHome();
	}

	async openDeckDetails() {
		this.sidebarService.deselectDeckElement();
		await this.navigationService.openDeck(this.deck!!.id);
	}

	async goHome() {
		await this.navigationService.goHome();
	}

	async studyCurrent() {
		if (ElementTypeUtilities.isTable(this.selectedDeckElement)) {
			this.setupSessionModal?.openDialog();
		} else if (ElementTypeUtilities.isGraph(this.selectedDeckElement)) {
			if (await this.graphElementService.anyNodesAndEdgesExist(this.selectedDeckElement!!)) {
				this.setupSessionModal?.openDialog();
			} else {
				UIkit.notification("Add nodes and edges to study", {status: 'warning'});
			}
		} else if (ElementTypeUtilities.isFlashcardSet(this.selectedDeckElement)) {
			if (await this.flashcardService.anyCardsExist(this.selectedDeckElement)) {
				this.setupSessionModal?.openDialog();
			} else {
				UIkit.notification("No cards to study in the set", {status: 'warning'});
			}
		}
	}

	private async onTablesChanged(deck: Deck) {
		this.tables = await this.tableService.getByDeck(deck);
		if (ElementTypeUtilities.isTable(this.selectedDeckElement)
			&& !this.tables.find(x => x.id === this.selectedDeckElement!!.id)) {
			this.sidebarService.deselectDeckElement();
		}
	}

	private async onGraphsChanged(deck: Deck) {
		this.graphs = await this.graphService.getByDeck(deck);
		if (ElementTypeUtilities.isGraph(this.selectedDeckElement)
			&& !this.graphs.find(x => x.id === this.selectedDeckElement!!.id)) {
			this.sidebarService.deselectDeckElement();
		}
	}

	private async onCardListsChanged(deck: Deck) {
		this.flashcardSets = await this.flashcardSetService.getByDeck(deck);
		if (ElementTypeUtilities.isFlashcardSet(this.selectedDeckElement)
			&& !this.flashcardSets.find(x => x.id === this.selectedDeckElement!!.id)) {
			this.sidebarService.deselectDeckElement();
		}
	}

	private resetCurrentDeckElements() {
		this.tables = [];
		this.graphs = [];
		this.flashcardSets = [];
		this.selectedDeckElement = null;
	}
}
