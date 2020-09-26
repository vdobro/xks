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

import {Component, OnInit, Output} from '@angular/core';
import {Deck} from "../../models/Deck";
import {DeckService} from "../../services/deck.service";
import {ActivatedRoute} from "@angular/router";
import {NavigationControlService} from "../../services/navigation-control.service";
import {TableService} from "../../services/table.service";
import {NavigationService} from "../../services/navigation.service";
import {SidebarService} from "../../services/sidebar.service";
import {GraphService} from "../../services/graph.service";
import {TopBarService} from "../../services/top-bar.service";
import {NavbarNewTableComponent} from "../navbar-new-table/navbar-new-table.component";
import {NavBarItem} from "../nav-bar-item";
import {NavbarNewGraphComponent} from "../navbar-new-graph/navbar-new-graph.component";

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
export class DeckViewComponent implements OnInit {

	@Output()
	deck: Deck;

	anyElementsAvailable: boolean = true;

	constructor(
		private readonly deckService: DeckService,
		private readonly route: ActivatedRoute,
		private readonly navigationService: NavigationService,
		private readonly sidebarService: SidebarService,
		private readonly topBarService: TopBarService,
		private readonly navigationControlService: NavigationControlService,
		private readonly tableService: TableService,
		private readonly graphService: GraphService) {
	}

	async ngOnInit(): Promise<void> {
		this.route.paramMap.subscribe(async params => {
			this.deck = await this.deckService.getById(params.get(DECK_ID_PARAM));
			if (this.deck) {
				this.sidebarService.populate(this.deck);
				await this.checkIfAnyElementsAvailable();
			} else {
				await this.navigationService.goToDeckList();
			}
		});
		this.tableService.tablesChanged.subscribe(async deck => {
			if (this.deck?.id === deck.id) {
				await this.checkIfAnyElementsAvailable();
			}
		});

		this.topBarService.clearItems();
		this.topBarService.addItem(new NavBarItem(NavbarNewTableComponent));
		this.topBarService.addItem(new NavBarItem(NavbarNewGraphComponent));
		this.topBarService.setBackButtonLabel('Deck list');
		this.navigationControlService.setTopBarVisibility(true);
	}

	private async checkIfAnyElementsAvailable() {
		this.anyElementsAvailable =
			await this.tableService.anyExistForDeck(this.deck)
			|| await this.graphService.anyExistForDeck(this.deck);
	}
}
