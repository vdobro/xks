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
import {BehaviorSubject, Subscribable} from "rxjs";

import {Injectable} from '@angular/core';

import {Deck} from "@app/models/Deck";

import {stripTrailingSlash} from "@environments/utils";
import {environment} from "@environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
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

	private readonly _decksChanged = new BehaviorSubject<Deck[]>([]);
	readonly decksChanged: Subscribable<Deck[]> = this._decksChanged;

	constructor(private readonly repository: DeckRepository,
				private readonly userSessionService: UserSessionService,
				private readonly httpClient: HttpClient) {
		this.repository.sourceChanged.subscribe(async () => {
			await this.onDecksChanged();
		});
	}

	async getById(id: string): Promise<Deck> {
		return this.repository.getById(id);
	}

	async getAll(): Promise<Deck[]> {
		return await this.repository.getAll();
	}

	async create(name: string, description: string): Promise<void> {
		const ownerToken = uuid();
		const newDeck: Deck = {
			id: uuid(),
			name: name,
			description: description,
			database: '',
			ownerToken: ownerToken,
		};
		await this.repository.add(newDeck, "deck");
		newDeck.database = await this.getRemoteDatabaseName(newDeck);
		await this.repository.update(newDeck);

		await this.onDecksChanged();
	}

	async update(deck: Deck) {
		await this.repository.update(deck);
		await this.onDecksChanged();
	}

	async delete(deck: Deck) {
		if (this.userSessionService.isLoggedIn()) {
			await this.repository.destroy();
			const params = new HttpParams()
				.append('token', deck.ownerToken)
				.append('username', this.userSessionService.getUserName()!);
			const url = this.deckApiRoot + "/" + deck.id + "?" + params.toString();
			await this.httpClient.delete(url).toPromise();
		}
		await this.repository.delete(deck.id);
		await this.onDecksChanged();
	}

	private async getRemoteDatabaseName(deck: Deck): Promise<string> {
		if (!this.userSessionService.isLoggedIn()) {
			return '';
		}
		const result = await this.httpClient.post<{
			database: string
		}>(this.deckApiRoot + "/" + deck.id, {
			username: this.userSessionService.getUserName()!
		}).toPromise();
		return result.database;
	}

	private async onDecksChanged() {
		this._decksChanged.next(await this.getAll());
	}
}
