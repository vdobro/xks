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

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Deck} from "../../models/Deck";
import {NavigationControlService} from "../../services/navigation-control.service";
import {Table} from "../../models/Table";
import {TableService} from "../../services/table.service";
import {NewTableModalComponent} from "../new-table-modal/new-table-modal.component";
import {DeckService} from "../../services/deck.service";
import {ConfirmDeleteDeckModalComponent} from "../confirm-delete-deck-modal/confirm-delete-deck-modal.component";
import {NavigationService} from "../../services/navigation.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.07.12
 */
@Component({
	selector: 'div [app-sidebar]',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit, AfterViewInit {

	@ViewChild("offcanvas", {static: true})
	sideBar: ElementRef;

	@ViewChild(NewTableModalComponent)
	newTableModal: NewTableModalComponent;

	@ViewChild(ConfirmDeleteDeckModalComponent)
	confirmDeleteDeckModal: ConfirmDeleteDeckModalComponent;

	deck: Deck;
	tables: Table[] = [];
	selectedTable: Table = null;
	tableSelected: boolean = false;

	active: boolean = false;

	constructor(private readonly navigationControlService: NavigationControlService,
				private readonly deckService: DeckService,
				private readonly tableService: TableService,
				private readonly navigationService: NavigationService) {
		this.navigationControlService.sidebarVisible().subscribe(value => this.onVisibilityChanged(value));
		this.navigationControlService.activeDeck().subscribe(value => this.onActiveDeckChanged(value));
		this.navigationControlService.activeTable().subscribe(value => this.onActiveTableChanged(value));
	}

	ngAfterViewInit(): void {
	}

	ngOnInit(): void {
		this.onActiveTableChanged(this.navigationControlService.currentTable);
		this.onActiveDeckChanged(this.navigationControlService.currentDeck);
		this.onVisibilityChanged(this.deck !== null);
	}

	private onVisibilityChanged(isVisible: boolean) {
		this.active = isVisible;
	}

	private onActiveTableChanged(table: Table) {
		this.tableSelected = table !== null && table !== undefined;
		this.selectedTable = table;
	}

	private onActiveDeckChanged(deck: Deck) {
		this.deck = deck;
		if (deck === null) {
			this.tables = [];
		} else {
			this.tableService.getByDeck(this.deck).then((tables: Table[]) => {
				this.tables = tables;
			});
		}
	}

	async onTableDeleted(tableId: string) {
		this.tables = this.tables.filter(item => item.id !== tableId);
		this.navigationControlService.deselectTable();
		await this.navigationService.navigateToCurrentDeck();
	}

	async onNewTableCreated(table: Table) {
		this.tables.push(table);
		await this.navigationControlService.deselectTable();
		await this.navigationService.navigateToCurrentDeck();
	}

	async onDeckDeleted() {
		if (this.deck === null) {
			this.tables = [];
			return;
		}

		await this.deckService.delete(this.deck);
		this.deck = null;
		this.tables = [];
		await this.goHome();
	}

	async openDeckDetails() {
		this.navigationControlService.deselectTable();
		await this.navigationService.openDeck(this.deck.id);
	}

	async goHome() {
		await this.navigationService.goHome();
	}
}
