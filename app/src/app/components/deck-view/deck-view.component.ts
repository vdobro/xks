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

import {Component, OnDestroy, OnInit, Output} from '@angular/core';
import {Deck} from "../../models/Deck";
import {DeckService} from "../../services/deck.service";
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../services/navigation.service";
import {Table} from "../../models/Table";
import {TableService} from "../../services/table.service";

export const DECK_ID_PARAM: string = 'deckId';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.23
 */
@Component({
	selector: 'app-deck-view',
	templateUrl: './deck-view.component.html',
	styleUrls: ['./deck-view.component.sass']
})
export class DeckViewComponent implements OnInit, OnDestroy {

	@Output()
	deck: Deck;

	@Output()
	selectedTable: Table;

	@Output()
	anyTablesAvailable: boolean = false;

	constructor(private deckService: DeckService,
				private route: ActivatedRoute,
				private navigationService: NavigationService,
				private tableService: TableService) {
	}

	async ngOnInit(): Promise<void> {
		this.route.paramMap.subscribe(async params => {
			this.deck = await this.deckService.getById(params.get(DECK_ID_PARAM));
			this.navigationService.populateSidebar(this.deck);
			this.anyTablesAvailable = await this.tableService.anyExistForDeck(this.deck);
		});
		this.navigationService.activeTable().subscribe((table: Table) => {
			this.selectedTable = table;
		});
	}

	ngOnDestroy() {
		this.navigationService.populateSidebar(null);
	}
}
