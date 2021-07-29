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

import {v4 as uuid} from 'uuid';
import {Subject, Subscribable} from "rxjs";

import {Injectable} from '@angular/core';

import {Deck} from "@app/models/Deck";

import {stripTrailingSlash} from "@environments/utils";
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserSessionService} from "@app/services/user-session.service";
import {DeckRepository} from "@app/repositories/deck-repository.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.14
 */
@Injectable({
	providedIn: 'root'
})
export class DeckService {
	private readonly apiRoot = stripTrailingSlash(environment.serverUrl);
	private readonly deckApiRoot = `${this.apiRoot}/api/deck`;

	private readonly _decksChanged = new Subject<void>();
	readonly decksChanged: Subscribable<void> = this._decksChanged;

	constructor(private readonly repository: DeckRepository,
				private readonly userSessionService: UserSessionService,
				private readonly httpClient: HttpClient) {
	}

	async getById(id: string): Promise<Deck> {
		return this.repository.getById(id);
	}

	async getAll(): Promise<Deck[]> {
		return await this.repository.getAll();
	}

	async create(name: string, description: string): Promise<Deck> {
		const newDeck: Deck = {
			id: uuid(),
			name: name,
			description: description,
			database: ''
		};
		await this.repository.add(newDeck, "deck");
		const databaseName = await this.getRemoteDatabaseName(newDeck);

		this._decksChanged.next();
		newDeck.database = databaseName;
		return newDeck;
	}

	async update(deck: Deck) {
		await this.repository.update(deck);
	}

	async delete(deck: Deck) {
		await this.repository.delete(deck.id);
		//TODO API call? id validation

		this._decksChanged.next();
	}

	private async getRemoteDatabaseName(deck: Deck): Promise<string> {
		if (!this.userSessionService.isLoggedIn()) {
			return '';
		}
		const result = await this.httpClient.post<{
			database: string
		}>(this.deckApiRoot + "/" + deck.id, {
			username: this.userSessionService.getUserName()!!
		}).toPromise();
		return result.database;
	}
}
