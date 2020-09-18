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
import {Subject, Subscribable} from "rxjs";
import {User} from "../models/User";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const USERNAME_KEY = "current_user_name";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.07
 */
@Injectable({
	providedIn: 'root'
})
export class UserSessionService {

	private readonly httpOptions = {
		withCredentials: true
	}

	private readonly userApiRoot = environment.serverUrl + "/api/user";
	private readonly registrationUrl = this.userApiRoot + "/register";
	private readonly forgetUrl = this.userApiRoot + "/forget";

	private readonly sessionUrl = environment.databaseUrl + "_session";
	private readonly infoUrlPrefix = environment.databaseUrl + "_users/org.couchdb.user:"

	private readonly _userLoggedIn = new Subject<boolean>();
	private readonly _currentUserChanged = new Subject<User>();

	readonly userLoggedIn: Subscribable<boolean> = this._userLoggedIn;
	readonly userChanged: Subscribable<User> = this._currentUserChanged;

	private currentUser: User = null;

	constructor(private httpClient: HttpClient) {
		this.getUser().then(async () => {
			const user = await this.getUser();
			await this.updateCurrentUser(user);
		}).catch(async () => {
			await this.logout();
		});
	}

	async login(username: string, password: string) {
		try {
			await this.httpClient.post(this.sessionUrl,
				UserSessionService.authRequest(username, password),
				this.httpOptions).toPromise();
			UserSessionService.saveUsername(username);
			const user = await this.getUser();
			this.updateCurrentUser(user);
		} catch (e) {
			await this.logout();
			const responseObject = e.error;
			throw new Error(responseObject.error);
		}
	}

	async register(username: string, password: string) {
		try {
			await this.httpClient.post(this.registrationUrl,
				UserSessionService.authRequest(username, password)).toPromise();
			await this.logout();
			await this.login(username, password);
		} catch (e) {
			await this.logout();
			const responseObject = e.error;
			throw new Error(responseObject.error);
		}
	}

	async logout() {
		this.updateCurrentUser(null);
		await this.deleteSession();
	}

	async deleteUser(username: string, password: string) {
		await this.logout();
		await this.httpClient.post(this.forgetUrl,
			UserSessionService.authRequest(username, password),
			this.httpOptions).toPromise();
	}

	private updateCurrentUser(user: User) {
		if (user) {
			UserSessionService.saveUsername(user.name);
		} else {
			UserSessionService.forgetUsername();
		}
		this.currentUser = user;
		this._userLoggedIn.next(this.currentUser !== null
			&& this.currentUser !== undefined);
		this._currentUserChanged.next(user);
	}

	private static authRequest(username: string, password: string): UserAuth {
		return {
			name: username,
			password: password
		};
	}

	private async deleteSession() {
		try {
			UserSessionService.forgetUsername();
			await this.httpClient.delete(this.sessionUrl).toPromise();
		} catch (e) {
		}
	}

	private async getUser(): Promise<User> {
		const username = localStorage.getItem(USERNAME_KEY);
		if (username) {
			return await this.httpClient.get<User>(this.infoUrlPrefix + username,
				this.httpOptions).toPromise();
		} else {
			return null;
		}
	}

	private static saveUsername(username: string) {
		localStorage.setItem(USERNAME_KEY, username);
	}

	private static forgetUsername() {
		localStorage.removeItem(USERNAME_KEY);
	}
}

export interface UserAuth {
	name: string,
	password: string
}
