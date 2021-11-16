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

import {v4 as uuid} from "uuid";
import {Subject, Subscribable} from "rxjs";

import {Injectable} from '@angular/core';

import {DeckElementType, getId} from "@app/models/deck-element";
import {FlashcardSet} from "@app/models/flashcard-set";
import {ElementId} from "@app/models/element-id";
import {Deck} from "@app/models/deck";

import {DeckElementService} from "@app/services/deck-element.service";
import {Flashcard} from "@app/models/flashcard";
import {filter, find} from "lodash-es";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2021.11.15
 */
@Injectable({
	providedIn: 'root'
})
export class FlashcardSetService {

	private static readonly elementType: DeckElementType = "flashcards";

	private readonly _setsChanged = new Subject<string>();
	readonly setsChanged: Subscribable<string> = this._setsChanged.asObservable();

	private readonly _setChanged = new Subject<FlashcardSet>();
	readonly setChanged = this._setChanged.asObservable();

	constructor(private readonly deckElementService: DeckElementService) {
		this.setChanged.subscribe((set) => this._setsChanged.next(set.deckId));
	}

	public async getById(id: ElementId): Promise<FlashcardSet> {
		return await this.deckElementService.findFlashcardSet(id);
	}

	async getByDeckId(deckId: string): Promise<FlashcardSet[]> {
		return await this.deckElementService.getAllFlashcardSets(deckId);
	}

	async getByDeck(deck: Deck): Promise<FlashcardSet[]> {
		return await this.getByDeckId(deck.id);
	}

	async anyExistForDeck(deck: Deck): Promise<boolean> {
		return await this.deckElementService.existAny(deck.id, FlashcardSetService.elementType);
	}

	async create(deck: Deck, name: string): Promise<FlashcardSet> {
		const set: FlashcardSet = {
			id: uuid(),
			deckId: deck.id,
			name: name,
			defaultMaxScore: 5,
			defaultStartingScore: 3,
			cards: [],
		};
		await this.deckElementService.add(set, FlashcardSetService.elementType);
		this._setsChanged.next(deck.id);
		return set;
	}

	public async delete(id: ElementId): Promise<void> {
		await this.deckElementService.delete(id);

		this._setsChanged.next(id.deck);
	}

	public async deleteAllInDeck(deck: Deck): Promise<void> {
		const flashcardLists = await this.getByDeck(deck);
		for (let list of flashcardLists) {
			await this.delete({element: list.id, deck: deck.id});
		}
		this._setsChanged.next(deck.id);
	}

	public async update(set: FlashcardSet): Promise<FlashcardSet> {
		const result = await this.deckElementService.updateElement(set) as FlashcardSet;
		this._setChanged.next(result);
		return result;
	}

	async addCard(question: string, answer: string, cardSet: FlashcardSet): Promise<Flashcard> {
		//TODO: is the refetching really needed?
		const set = await this.getById(getId(cardSet));
		const card: Flashcard = {
			id: uuid(),
			question: question,
			value: {
				default: answer,
				alternatives: []
			}
		};
		set.cards = [...cardSet.cards, card];
		await this.update(set);
		return card;
	}

	async deleteCard(card: FlashCardInSet) {
		//TODO: is the refetching really needed?
		const flashcardSet = await this.getById(getId(card.set));
		flashcardSet.cards = filter(flashcardSet.cards, x => x.id !== card.card.id);
		await this.update(flashcardSet);
	}

	async updateCard(card: FlashCardInSet,
					 question: string, answer: string) {
		const flashcardSet = await this.getById(getId(card.set));
		const editedCard = find(flashcardSet.cards, c => c.id === card.card.id);
		if (!editedCard) {
			console.warn("Could not update flashcard");
			return;
		}
		editedCard.value.default = answer;
		editedCard.question = question;
		await this.update(flashcardSet);
	}
}

export type FlashCardInSet = {
	card: Flashcard;
	set: FlashcardSet;
}
