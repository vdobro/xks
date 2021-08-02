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

	tables: Table[] = [];
	graphs: Graph[] = [];

	selectedTable: Table | null = null;
	tableSelected: boolean = false;

	selectedGraph: Graph | null = null;
	graphSelected: boolean = false;

	active: boolean = false;

	constructor(private readonly navControlService: NavigationControlService,
				private readonly sidebarService: SidebarService,
				private readonly deckService: DeckService,
				private readonly tableService: TableService,
				private readonly graphService: GraphService,
				private readonly graphElementService: GraphElementService,
				private readonly navigationService: NavigationService) {
		this.navControlService.sidebarVisible.subscribe((value: boolean) => this.onVisibilityChanged(value));
		this.sidebarService.activeDeck.subscribe(async (value: Deck | null) => this.onActiveDeckChanged(value));
		this.sidebarService.activeTable.subscribe((value: Table | null) => this.onActiveTableChanged(value));
		this.sidebarService.activeGraph.subscribe((value: Graph | null) => this.onActiveGraphChanged(value));
		this.tableService.tablesChanged.subscribe((deckId: string) => this.onTablesChanged(deckId));
		this.graphService.deckGraphsChanged.subscribe((deckId: string) => this.onGraphsChanged(deckId));
	}

	async ngOnInit() {
		this.onActiveTableChanged(this.sidebarService.currentTable);
		this.onActiveGraphChanged(this.sidebarService.currentGraph);
		await this.onActiveDeckChanged(this.sidebarService.currentDeck);
		this.onVisibilityChanged(this.deck !== null);
	}

	private onVisibilityChanged(isVisible: boolean) {
		if (this.active !== isVisible) {
			this.active = isVisible;
		}
	}

	private onActiveTableChanged(table: Table | null) {
		if (this.selectedTable?.id === table?.id) {
			return;
		}
		this.tableSelected = !!table;
		if (this.selectedTable?.id !== table?.id) {
			this.selectedTable = table;
		}
	}

	private onActiveGraphChanged(graph: Graph | null) {
		if (this.selectedGraph?.id === graph?.id) {
			return;
		}
		this.graphSelected = !!graph;
		if (this.selectedGraph?.id !== graph?.id) {
			this.selectedGraph = graph;
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
		this.sidebarService.deselectTable();
		this.sidebarService.deselectGraph();
		await this.navigationService.openDeck(this.deck!!.id);
	}

	async goHome() {
		await this.navigationService.goHome();
	}

	async studyCurrent() {
		if (this.tableSelected) {
			this.setupSessionModal?.openDialog();
		} else if (this.graphSelected) {
			if (await this.graphElementService.anyNodesAndEdgesExist(this.selectedGraph!!)) {
				this.setupSessionModal?.openDialog();
			} else {
				UIkit.notification("Add nodes and edges to study", {status: 'warning'});
			}
		}
	}

	private async onTablesChanged(deckId: string) {
		this.tables = await this.tableService.getByDeckId(deckId);
		if (this.selectedTable && !this.tables.find(x => x.id === this.selectedTable!!.id)) {
			this.sidebarService.deselectTable();
		}
	}

	private async onGraphsChanged(deckId: string) {
		this.graphs = await this.graphService.getByDeckId(deckId);
		if (this.selectedGraph && !this.graphs.find(x => x.id === this.selectedGraph!!.id)) {
			this.sidebarService.deselectGraph();
		}
	}

	private resetCurrentDeckElements() {
		this.graphSelected = false;
		this.tableSelected = false;
		this.tables = [];
		this.graphs = [];
		this.selectedTable = null;
		this.selectedGraph = null;
	}
}
