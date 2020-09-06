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

import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {NavBarItem} from "../components/nav-bar-item";
import {Deck} from "../models/Deck";
import {Table} from "../models/Table";
import {DeckService} from "./deck.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.20
 */
@Injectable({
	providedIn: 'root'
})
export class NavigationControlService {

	private readonly itemsObservable: Subject<NavBarItem[]> = new Subject();
	private readonly topBarVisible$: Subject<boolean> = new Subject();
	private readonly sidebarVisible$: Subject<boolean> = new Subject();
	private readonly activeDeck$: Subject<Deck> = new Subject();
	private readonly activeTable$: Subject<Table> = new Subject();

	private items: NavBarItem[] = [];
	currentDeck: Deck;
	currentTable: Table;

	constructor(private readonly deckService: DeckService) {
	}

	getAll(): Observable<NavBarItem[]> {
		return this.itemsObservable;
	}

	topNavBarVisible(): Observable<boolean> {
		return this.topBarVisible$;
	}

	sidebarVisible(): Observable<boolean> {
		return this.sidebarVisible$;
	}

	activeDeck(): Observable<Deck> {
		return this.activeDeck$;
	}

	activeTable(): Observable<Table> {
		return this.activeTable$;
	}

	addItem(item: NavBarItem) {
		this.items.push(item);
		this.update();
	}

	clear() {
		this.items.length = 0;
		this.update();
	}

	async populateSidebarWithTable(table: Table) {
		if (this.currentTable?.id === table?.id) {
			return;
		}
		this.currentTable = table;
		if (table === null) {
			this.populateSidebar(null);
		}
		const deck = await this.deckService.getById(table.deckId);
		this.populateSidebar(deck);
	}

	populateSidebar(deck: Deck) {
		const deckIsNull = deck === null;
		this.setTopBarVisibility(deckIsNull);
		this.activeDeck$.next(deck);
		this.currentDeck = deck;
		if (deckIsNull) {
			this.currentTable = null;
			this.activeTable$.next(null);
		}
	}

	deselectTable() {
		this.currentTable = null;
		this.activeTable$.next(null);
	}

	async selectTable(table: Table) {
		if (this.currentTable?.id === table.id) {
			return;
		}
		this.currentTable = table;
		this.activeTable$.next(table);
		if (table) {
			const deck = await this.deckService.getById(table.deckId);
			if (this.currentDeck?.id !== deck.id) {
				this.populateSidebar(deck);
			}
		}
	}

	hideSidebar() {
		this.populateSidebar(null);
	}

	private setTopBarVisibility(show: boolean) {
		this.sidebarVisible$.next(!show);
		this.topBarVisible$.next(show);
	}

	private update() {
		this.itemsObservable.next(this.items);
	}
}
