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
import {DeckListNavbarComponent} from "../deck-list-navbar/deck-list-navbar.component";
import {NavBarItem} from "../nav-bar-item";
import {TopBarService} from "../../services/top-bar.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.23
 */
@Component({
	selector: 'app-deck-list-page',
	templateUrl: './deck-list-page.component.html',
	styleUrls: ['./deck-list-page.component.sass']
})
export class DeckListPageComponent implements OnInit {

	@ViewChild(DeckListViewComponent)
	deckListView: DeckListViewComponent;

	decks: Promise<Deck[]> = this.deckService.getAll();

	constructor(private readonly deckService: DeckService,
				private readonly topBarService: TopBarService) {
	}

	ngOnInit(): void {
		this.topBarService.clearItems();
		this.topBarService.addItem(new NavBarItem(DeckListNavbarComponent));
		this.deckService.deckCreated().subscribe(_ => this.onNewDeckCreated());
	}

	onNewDeckCreated() {
		this.deckListView.onNewDeckCreated();
		this.decks = this.deckService.getAll();
	}
}
