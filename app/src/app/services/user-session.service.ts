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

	readonly userLoggedIn: Observable<boolean> = this._userLoggedIn;

	private currentUser: User = null;

	constructor(private httpClient: HttpClient) {
	}

	async login(username: string, password: string): Promise<User> {
		try {
			this.updateUser(await this.getUser(username, password));
			return this.getCurrent();
		} catch (e) {
			return null;
		}
	}

	async register(username: string, password: string): Promise<User> {
		const user = await this.postCredentials(this.registrationUrl, username, password);
		this.updateUser(user);
		return this.getCurrent();
	}

	logout() {
		this.updateUser(null);
	}

	async forget(username: string, password: string) {
		await this.postCredentials(this.forgetUrl, username, password);
	}

	getCurrent(): User {
		return this.currentUser;
	}

	private updateUser(user: User) {
		this.currentUser = user;
		this._userLoggedIn.next(this.currentUser !== null
			&& this.currentUser !== undefined);
	}

	private async getUser(username: string, password: string): Promise<User> {
		return await this.postCredentials(this.loginUrl, username, password);
	}

	private async postCredentials(url: string,
								  username: string,
								  password: string): Promise<User> {
		return await this.httpClient.post<User>(url,
			{
				username: username,
				password: password
			},
			{
				responseType: 'json'
			}).toPromise();
	}
}
