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

import UIkit from 'uikit';
import {Deck} from "../../models/Deck";
import {NavigationService} from "../../services/navigation.service";
import {Table} from "../../models/Table";
import {TableService} from "../../services/table.service";
import {NewTableModalComponent} from "../new-table-modal/new-table-modal.component";
import {Router} from "@angular/router";
import {DeckService} from "../../services/deck.service";

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit, AfterViewInit {

	@ViewChild("offcanvas", {static: true})
	sideBar: ElementRef;

	@ViewChild(NewTableModalComponent)
	newTableModal: NewTableModalComponent;

	deck: Deck;
	tables: Table[] = [];

	private active: boolean;

	constructor(private navigationService: NavigationService,
				private deckService: DeckService,
				private tableService: TableService,
				private router: Router) {
		this.navigationService.sidebarVisible().subscribe((isVisible) => {
			this.active = (isVisible);
			this.update();
		});
		this.navigationService.activeDeck().subscribe((deck) => {
			this.deck = deck;
			if (deck === null) {
				this.tables = [];
			} else {
				this.tableService.getByDeck(this.deck).then((tables) => {
					this.tables = tables;
				});
			}
		});
	}

	ngAfterViewInit(): void {
	}

	ngOnInit(): void {
		UIkit.offcanvas(this.sideBar.nativeElement);
	}

	onTableDeleted(tableId: string): void {
		this.tables = this.tables.filter(item => item.id !== tableId);
	}

	onNewTableCreated(table: Table): void {
		this.tables.push(table);
	}

	async onDeckDeleted(): Promise<void> {
		if (this.deck === null) {
			this.tables = [];
			return;
		}

		await this.deckService.delete(this.deck);
		this.deck = null;
		this.tables = [];
		await this.router.navigate(['/']);
	}

	private update(): void {
		if (this.active) {
			UIkit.offcanvas(this.sideBar.nativeElement).show();
		} else {
			UIkit.offcanvas(this.sideBar.nativeElement).hide();
		}
	}
}
