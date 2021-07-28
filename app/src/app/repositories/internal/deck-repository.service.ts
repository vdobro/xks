/*
 * Copyright (C) 2021 Vitalijus Dobrovolskis
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

import {Deck} from "@app/models/Deck";

import {CouchDbRepository} from "@app/repositories/internal/couch-db-repository";

import {UserSessionService} from "@app/services/user-session.service";
import {User} from "@app/models/User";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.01
 */
@Injectable({
	providedIn: 'root'
})
export class DeckRepository extends CouchDbRepository<Deck> {

	constructor(userSessionService: UserSessionService) {
		super("local_decks", userSessionService);
		this.userSessionService.userChanged.subscribe(async user => {
			await this.userChangedHandler(user);
		})
	}

	protected resolveRemoteDatabaseName(user: User): string {
		const hex = user.name
			.split('')
			.map(c => c.charCodeAt(0).toString(16))
			.join('')
		return "userdb-" + hex;
	}

	private async userChangedHandler(user: User | null) : Promise<void> {
		if (user) {
			this.switchToRemote(user);
		} else {
			await this.switchToLocal();
		}
	}
}
