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
import {Graph, isGraph} from "@app/models/graph";
import {isTable, Table} from "@app/models/Table";
import {DeckElement} from "@app/models/DeckElement";
import {ElementId} from "@app/models/ElementId";

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

	tables: Table[] = [];
	graphs: Graph[] = [];

	selectedElement: DeckElement | null = null;
	elementSelected: boolean = false;

	active: boolean = false;

	constructor(private readonly navControlService: NavigationControlService,
				private readonly sidebarService: SidebarService,
				private readonly deckService: DeckService,
				private readonly tableService: TableService,
				private readonly graphService: GraphService,
				private readonly graphElementService: GraphElementService,
				private readonly navigationService: NavigationService) {
		this.navControlService.sidebarVisible.subscribe({next: (value: boolean) => this.onVisibilityChanged(value)});
		this.sidebarService.activeDeck.subscribe({next: async (value: Deck | null) => this.onActiveDeckChanged(value)});

		this.sidebarService.activeElement.subscribe({next: (value: DeckElement | null) => this.onActiveElementChanged(value)});

		this.tableService.tablesChanged.subscribe({next: (deckId: string) => this.onTablesChanged(deckId)});
		this.graphService.graphsChanged.subscribe({next: (deckId: string) => this.onGraphsChanged(deckId)});
	}

	async ngOnInit() {
		this.onActiveElementChanged(this.sidebarService.currentDeckElement);
		await this.onActiveDeckChanged(this.sidebarService.currentDeck);
		this.onVisibilityChanged(this.deck !== null);
	}

	private onVisibilityChanged(isVisible: boolean) {
		if (this.active !== isVisible) {
			this.active = isVisible;
		}
	}

	private onActiveElementChanged(table: DeckElement | null) {
		if (this.selectedElement?.id === table?.id && table === null) {
			return;
		}
		this.elementSelected = !!table;
		if (this.selectedElement?.id !== table?.id) {
			this.selectedElement = table;
		}
	}

	private async onActiveDeckChanged(deck: Deck | null): Promise<void> {
		if (this.deck?.id === deck?.id) {
			return;
		}
		this.deck = deck;
		if (this.deck) {
			this.tables = await this.tableService.getByDeck(this.deck);
			this.graphs = await this.graphService.getByDeck(this.deck);
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
		await this.navigationService.openDeck(this.deck!.id);
	}

	async goHome() {
		await this.navigationService.goHome();
	}

	async studyCurrent() {
		if (isTable(this.selectedElement)) {
			if (this.selectedElement!.rows.length > 0) {
				this.setupSessionModal?.openDialog();
			} else {
				UIkit.notification("Add columns and rows to study.", {status: 'warning'});
			}
		}
		if (isGraph(this.selectedElement)) {
			if (this.graphElementService.anyNodesAndEdgesExist(this.selectedElement!)) {
				this.setupSessionModal?.openDialog();
			} else {
				UIkit.notification("Add nodes and edges to study.", {status: 'warning'});
			}
		}
	}

	private async onTablesChanged(deckId: string) {
		this.tables = await this.tableService.getByDeckId(deckId);
		if (!isTable(this.selectedElement)) {
			return;
		}
		if (this.tables.find(x => x.id === this.selectedElement!.id)) {
			this.selectedElement = await this.tableService.getById(this.getElementId());
			return;
		}
		this.sidebarService.deselectDeckElement();
	}

	private async onGraphsChanged(deckId: string) {
		this.graphs = await this.graphService.getByDeckId(deckId);
		if (!isGraph(this.selectedElement)) {
			return;
		}
		if (this.graphs.find(x => x.id === this.selectedElement!.id)) {
			this.selectedElement = await this.graphService.getById(this.getElementId());
			return;
		}
		this.sidebarService.deselectDeckElement();
	}

	private resetCurrentDeckElements() {
		this.elementSelected = false;
		this.selectedElement = null;
		this.tables = [];
		this.graphs = [];
	}

	private getElementId(): ElementId {
		if (!this.selectedElement) {
			throw Error("No selected deck element");
		}
		return {
			element: this.selectedElement!.id,
			deck: this.selectedElement!.deckId
		}
	}
}
