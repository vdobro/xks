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

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.20
 */
@Injectable({
	providedIn: 'root'
})
export class NavigationService {

	private items: NavBarItem[] = [];

	private itemsObservable: Subject<NavBarItem[]> = new Subject();
	private topBarVisible$: Subject<boolean> = new Subject();
	private sidebarVisible$: Subject<boolean> = new Subject();
	private activeDeck$: Subject<Deck> = new Subject();
	private activeTable$: Subject<Table> = new Subject();

	constructor() {
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

	populateSidebar(deck: Deck) {
		const deckIsNull = deck === null;
		this.setTopBarVisibility(deckIsNull);
		this.activeDeck$.next(deck);
		if (deckIsNull) {
			this.activeTable$.next(null);
		}
	}

	selectTable(table: Table) {
		this.activeTable$.next(table);
	}

	private setTopBarVisibility(show: boolean) {
		this.sidebarVisible$.next(!show);
		this.topBarVisible$.next(show);
	}

	private update() {
		this.itemsObservable.next(this.items);
	}
}
