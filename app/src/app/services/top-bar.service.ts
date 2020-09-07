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
import {NavBarItem} from "../components/nav-bar-item";
import {Subject, Subscribable} from "rxjs";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.07
 */
@Injectable({
	providedIn: 'root'
})
export class TopBarService {

	private readonly currentItems: NavBarItem[] = [];
	private readonly items$ = new Subject<NavBarItem[]>();

	readonly allItems: Subscribable<NavBarItem[]> = this.items$;

	constructor() {
	}

	addItem(item: NavBarItem) {
		this.currentItems.push(item);
		this.update();
	}

	clearItems() {
		this.currentItems.splice(0, this.currentItems.length);
		this.update();
	}

	private update() {
		this.items$.next(this.currentItems);
	}
}
