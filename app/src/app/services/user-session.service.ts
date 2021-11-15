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
import {User} from "@app/models/User";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "@environments/environment";
import {stripTrailingSlash} from "@environments/utils";

const USERNAME_KEY = "current_user_name";

const HTTP_OPTIONS = {
	withCredentials: true
}

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.07
 */
@Injectable({
	providedIn: 'root'
})
export class UserSessionService {

	private readonly apiRoot = stripTrailingSlash(environment.serverUrl);
	private readonly databaseRoot = stripTrailingSlash(environment.databaseUrl);

	private readonly userApiRoot = this.apiRoot + "/api/user";
	private readonly registrationUrl = this.userApiRoot + "/register";
	private readonly forgetUrl = this.userApiRoot + "/forget";

	private readonly sessionUrl = this.databaseRoot + "/_session";
	private readonly infoUrlPrefix = this.databaseRoot + "/_users/org.couchdb.user:";

	private readonly _userLoggedIn = new Subject<boolean>();
	private readonly _currentUserChanged = new Subject<User | null>();

	readonly userLoggedIn: Subscribable<boolean> = this._userLoggedIn.asObservable();
	readonly userChanged: Subscribable<User | null> = this._currentUserChanged.asObservable();

	private currentUser: User | null = null;

	constructor(private readonly httpClient: HttpClient) {
		this.getUser().then((result) => {
			this.updateCurrentUser(result);
		}).catch(async () => {
			await this.logout();
		});
	}

	async login(username: string, password: string) {
		try {
			await this.httpClient.post(
				this.sessionUrl,
				UserSessionService.authRequest(username, password),
				HTTP_OPTIONS).toPromise();

			UserSessionService.saveUsername(username);
			const user = await this.getUser();
			this.updateCurrentUser(user);
		} catch (e) {
			await this.handleCredentialException(e);
		}
	}

	async register(username: string, password: string) {
		try {
			await this.httpClient.post(this.registrationUrl,
				UserSessionService.authRequest(username, password)).toPromise();
			await this.logout();
			await this.login(username, password);
		} catch (e) {
			await this.handleCredentialException(e);
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
			HTTP_OPTIONS).toPromise();
	}

	isLoggedIn() : boolean {
		return this.getUserName() !== null;
	}

	getCurrentUser() : User | null {
		return this.currentUser;
	}

	getUserName() : string | null {
		return this.currentUser?.name || null;
	}

	private updateCurrentUser(user: User | null) {
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

	private async getUser(): Promise<User | null> {
		const username = localStorage.getItem(USERNAME_KEY);
		if (username) {
			return await this.httpClient.get<User>(this.infoUrlPrefix + username, HTTP_OPTIONS).toPromise();
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

	private async handleCredentialException(e: HttpErrorResponse) {
		await this.logout();
		switch (e.status) {
			case 401:
				throw new Error("Wrong username and/or password.");
			case 400:
				throw new Error(e?.error?.error || "Unknown error occurred.");
			default:
				throw new Error("Unknown error occurred.");
		}
	}
}

export interface UserAuth {
	name: string,
	password: string
}
