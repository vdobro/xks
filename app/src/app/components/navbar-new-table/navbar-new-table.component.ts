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

import {Component, OnInit, ViewChild} from '@angular/core';
import {NewDeckElementModalComponent} from "../new-deck-element-modal/new-deck-element-modal.component";
import {TableService} from "../../services/table.service";
import {Deck} from "../../models/Deck";
import {SidebarService} from "../../services/sidebar.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.13
 */
@Component({
	selector: 'li [navbar-new-table]',
	templateUrl: './navbar-new-table.component.html',
	styleUrls: ['./navbar-new-table.component.sass']
})
export class NavbarNewTableComponent implements OnInit {

	@ViewChild(NewDeckElementModalComponent)
	childModal: NewDeckElementModalComponent | undefined;

	deck: Deck | null;

	constructor(private readonly tableService: TableService,
				private readonly sidebarService: SidebarService) {
		this.sidebarService.activeDeck.subscribe(value => this.deck = value);
		this.deck = this.sidebarService.currentDeck;
	}

	ngOnInit(): void {
	}

	async createTable(name: string) {
		if (this.deck) {
			await this.tableService.create(this.deck, name);
		}
	}
}
