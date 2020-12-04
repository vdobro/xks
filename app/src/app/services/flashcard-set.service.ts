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
import {FlashcardSet} from "../models/FlashcardSet";
import {FlashcardSetRepository} from "../repositories/flashcard-set-repository.service";
import {Deck} from "../models/Deck";
import {v4 as uuid} from "uuid";
import {DeckElementTypes} from "../models/DeckElementTypes";
import {Subject, Subscribable} from "rxjs";
import {DeckRepository} from "../repositories/deck-repository.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.11.21
 */
@Injectable({
	providedIn: 'root'
})
export class FlashcardSetService {

	private readonly _cardSetsChanged = new Subject<Deck>();

	readonly setsChanged : Subscribable<Deck> = this._cardSetsChanged;

	constructor(
		private readonly repository: FlashcardSetRepository,
		private readonly deckRepository: DeckRepository,
	) {
	}

	public async getById(id: string): Promise<FlashcardSet> {
		return await this.repository.getById(id);
	}

	async getByDeck(deck: Deck) : Promise<FlashcardSet[]> {
		return await this.repository.getByDeck(deck.id);
	}

	public async create(deck: Deck, name: string): Promise<FlashcardSet> {
		const cardList: FlashcardSet = {
			id: uuid(),
			deckId: deck.id,
			name: name,
			type: DeckElementTypes.Flashcards,
			defaultMaxScore: 8,
			defaultStartingScore: 4,
		};
		await this.repository.add(cardList);
		this._cardSetsChanged.next(deck);
		return cardList;
	}

	public async deleteAllInDeck(deck: Deck) {
		const all = await this.getByDeck(deck);
		for (let cardSet of all) {
			await this.delete(cardSet.id);
		}
		this._cardSetsChanged.next(deck);
	}

	public async delete(id: string) {
		const graph = await this.getById(id);
		await this.repository.delete(id);

		this._cardSetsChanged.next(await this.getDeck(graph));
	}

	public async update(set: FlashcardSet) {
		await this.repository.update(set);
	}

	private async getDeck(set: FlashcardSet): Promise<Deck> {
		return await this.deckRepository.getById(set.deckId);
	}
}
