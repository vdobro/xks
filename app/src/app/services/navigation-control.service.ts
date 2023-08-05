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

import {Subject, Subscribable} from "rxjs";

import {Injectable} from '@angular/core';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.20
 */
@Injectable({
	providedIn: 'root'
})
export class NavigationControlService {

	private readonly _topBarVisible$ = new Subject<boolean>();
	private readonly _sidebarVisible$ = new Subject<boolean>();
	private readonly _rootContainerWidth$ = new Subject<number>();

	readonly sidebarVisible: Subscribable<boolean> = this._sidebarVisible$;
	readonly topBarVisible: Subscribable<boolean> = this._topBarVisible$;
	readonly rootContainerWidth: Subscribable<number> = this._rootContainerWidth$;

	public setSidebarVisibility(visible: boolean): void {
		this._sidebarVisible$.next(visible);
	}

	public setTopBarVisibility(visible: boolean): void {
		this._topBarVisible$.next(visible);
	}

	public notifyRootContainerChange(width: number): void {
		this._rootContainerWidth$.next(width);
	}
}
