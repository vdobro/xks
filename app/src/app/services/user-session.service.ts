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

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.07
 */
@Injectable({
	providedIn: 'root'
})
export class UserSessionService {

	private readonly apiRoot = environment.serverUrl + "/api";
	private readonly registrationUrl = this.apiRoot + "/register";
	private readonly loginUrl = this.apiRoot + "/login";
	private readonly forgetUrl = this.apiRoot + "/forget";

	private readonly _userLoggedIn = new Subject<boolean>();
	private readonly _userAuthChanged = new Subject<UserAuth>();

	readonly userLoggedIn: Subscribable<boolean> = this._userLoggedIn;
	readonly userAuthChanged: Subscribable<UserAuth> = this._userAuthChanged;

	private currentUser: User = null;

	constructor(private httpClient: HttpClient) {
	}

	async login(username: string, password: string): Promise<User> {
		const user = await this.getUser(username, password);
		this.updateUser(user, password);
		return this.getCurrent();
	}

	async register(username: string, password: string): Promise<User> {
		const user = await this.postCredentials(this.registrationUrl, username, password);
		this.updateUser(user, password);
		this._userAuthChanged.next({
			username: username,
			password: password
		});
		return this.getCurrent();
	}

	logout() {
		this.updateUser(null, null);
		this._userAuthChanged.next(null);
	}

	async forget(username: string, password: string) {
		await this.postCredentials(this.forgetUrl, username, password);
	}

	getCurrent(): User {
		return this.currentUser;
	}

	private updateUser(user: User, password: string) {
		this.currentUser = user;
		this._userLoggedIn.next(this.currentUser !== null
			&& this.currentUser !== undefined);
		if (password) {
			this._userAuthChanged.next({
				username: user.name,
				password: password
			});
		} else {
			this._userAuthChanged.next(null);
		}
	}

	private async getUser(username: string, password: string): Promise<User> {
		return await this.postCredentials(this.loginUrl, username, password);
	}

	private async postCredentials(url: string,
								  username: string,
								  password: string): Promise<User> {
		try {
			return await this.httpClient.post<User>(url,
				{
					username: username,
					password: password
				},
				{
					responseType: 'json'
				}).toPromise();
		} catch (e) {
			const responseObject = e.error;
			throw new Error(responseObject.error);
		}
	}
}

export interface UserAuth {
	username: string,
	password: string
}
