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
import {NavBarItem} from "@app/components/nav-bar-item";
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

	private readonly _items$ = new Subject<NavBarItem[]>();
	private readonly _backNavigationEnabled$ = new Subject<boolean>();
	private readonly _backButtonLabel$ = new Subject<string>();

	readonly allItems: Subscribable<NavBarItem[]> = this._items$;
	readonly backNavigationEnabled: Subscribable<boolean> = this._backNavigationEnabled$;
	readonly backButtonLabel: Subscribable<string> = this._backButtonLabel$;

	constructor() {
	}

	public addItem(item: NavBarItem): void {
		this.currentItems.push(item);
		this.update();
	}

	public clearItems(): void {
		this._backNavigationEnabled$.next(true);
		this._backButtonLabel$.next('');
		this.currentItems.splice(0, this.currentItems.length);
		this.update();
	}

	public disableBackButton(): void {
		this._backButtonLabel$.next('');
		this._backNavigationEnabled$.next(false);
	}

	public setBackButtonLabel(value: string): void {
		this._backButtonLabel$.next(value);
	}

	private update(): void {
		this._items$.next(this.currentItems);
	}
}
