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
import {ActivatedRoute, ParamMap} from "@angular/router";

import {Deck} from "@app/models/Deck";

import {DeckService} from "@app/services/deck.service";
import {NavigationControlService} from "@app/services/navigation-control.service";
import {TableService} from "@app/services/table.service";
import {NavigationService} from "@app/services/navigation.service";
import {SidebarService} from "@app/services/sidebar.service";
import {GraphService} from "@app/services/graph.service";
import {TopBarService} from "@app/services/top-bar.service";

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
	deck: Deck | null = null;

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
		this.route.paramMap.subscribe(async (params: ParamMap) => {
			const id = params.get(DECK_ID_PARAM);
			this.deck = id ? await this.deckService.getById(id) : null;
			if (this.deck) {
				this.sidebarService.populate(this.deck);
				await this.checkIfAnyElementsAvailable();
			} else {
				await this.navigationService.goToDeckList();
			}
		});
		this.tableService.tablesChanged.subscribe(async (deckId: string) => {
			if (this.deck?.id === deckId) {
				await this.checkIfAnyElementsAvailable();
			}
		});

		this.topBarService.clearItems();
		this.topBarService.setBackButtonLabel('Deck list');
		this.navigationControlService.setTopBarVisibility(true);
	}

	private async checkIfAnyElementsAvailable() {
		if (!this.deck) {
			this.anyElementsAvailable = false;
			return;
		}
		this.anyElementsAvailable = await this.tableService.anyExistForDeck(this.deck)
			|| await this.graphService.anyExistForDeck(this.deck);
	}
}
