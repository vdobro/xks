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
import {User} from "../models/User";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.07
 */
@Injectable({
	providedIn: 'root'
})
export class UserSessionService {

	private readonly _userLoggedIn = new Subject<boolean>();

	readonly userLoggedIn: Observable<boolean> = this._userLoggedIn;

	private currentUser: User = null;

	constructor() {
	}

	login(username: string, password: string): User {
		this.currentUser = null; //TODO: actual logic

		this.updateUser();
		return this.getCurrent();
	}

	logout() {
		this.currentUser = null;
		this.updateUser();
	}

	getCurrent(): User {
		return this.currentUser;
	}

	private updateUser() {
		this._userLoggedIn.next(this.currentUser !== null
			&& this.currentUser !== undefined);
	}
}
