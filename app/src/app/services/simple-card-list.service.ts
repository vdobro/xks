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
import {SimpleCardList} from "../models/SimpleCardList";
import {SimpleCardListRepository} from "../repositories/simple-card-list-repository.service";
import {Deck} from "../models/Deck";
import {v4 as uuid} from "uuid";
import {DeckElementTypes} from "../models/DeckElementTypes";
import {Subject, Subscribable} from "rxjs";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.11.21
 */
@Injectable({
	providedIn: 'root'
})
export class SimpleCardListService {

	private readonly _cardListsChanged = new Subject<Deck>();

	readonly cardListsChanged : Subscribable<Deck> = this._cardListsChanged;

	constructor(private readonly repository: SimpleCardListRepository) {
	}

	public async getById(id: string): Promise<SimpleCardList> {
		return await this.repository.getById(id);
	}

	async getByDeck(deck: Deck) : Promise<SimpleCardList[]> {
		return await this.repository.getByDeck(deck.id);
	}

	public async create(deck: Deck, name: string): Promise<SimpleCardList> {
		const cardList: SimpleCardList = {
			id: uuid(),
			deckId: deck.id,
			name: name,
			type: DeckElementTypes.SimpleCards,
			defaultMaxScore: 8,
			defaultStartingScore: 4,
		};
		await this.repository.add(cardList);
		this._cardListsChanged.next(deck);
		return cardList;
	}
}
