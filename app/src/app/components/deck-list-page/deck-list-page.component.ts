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
import {Deck} from "../../models/Deck";
import {DeckListViewComponent} from "../deck-list-view/deck-list-view.component";
import {DeckService} from "../../services/deck.service";
import {NavigationService} from "../../services/navigation.service";
import {DeckListNavbarComponent} from "../deck-list-navbar/deck-list-navbar.component";
import {NavBarItem} from "../nav-bar-item";

@Component({
	selector: 'app-deck-list-page',
	templateUrl: './deck-list-page.component.html',
	styleUrls: ['./deck-list-page.component.sass']
})
export class DeckListPageComponent implements OnInit {

	@ViewChild(DeckListViewComponent)
	deckListView: DeckListViewComponent;

	decks : Deck[] = this.deckService.getAll();

	constructor(private deckService: DeckService,
				private navigationService: NavigationService) {
	}

	ngOnInit(): void {
		this.navigationService.clear();
		this.navigationService.addItem(new NavBarItem(DeckListNavbarComponent));
	}

	onNewDeckCreated() {
		this.deckListView.onNewDeckCreated();
		this.decks = this.deckService.getAll();
	}
}
