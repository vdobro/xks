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

import {filter} from "lodash-es";

import {Injectable} from '@angular/core';

import {DeckElement, DeckElementType} from "@app/models/deck-element";
import {ElementId} from "@app/models/element-id";
import {Graph, isGraph} from "@app/models/graph";
import {Table, isTable} from "@app/models/table";
import {FlashcardSet, isFlashcardList} from "@app/models/flashcard-set";

import {DeckElementRepository} from "@app/repositories/deck-element-repository";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.10.11
 */
@Injectable({
	providedIn: 'root'
})
export class DeckElementService {

	constructor(private readonly repository: DeckElementRepository) {
	}

	async add(element: DeckElement, type: DeckElementType) : Promise<void> {
		await this.repository.add(element, type);
	}

	async delete(id: ElementId) {
		await this.repository.delete(id);
	}

	async deleteAll(deckId: string, type: DeckElementType) {
		const all = await this.repository.getAllByType(deckId, type);
		for (const element of all) {
			await this.delete({element: element.id, deck: deckId});
		}
	}

	async findTable(id: ElementId): Promise<Table> {
		const element = await this.repository.getById(id);
		if (!isTable(element)) {
			throw new Error(`Table ${id.element} not found`);
		}
		return element;
	}

	async findGraph(id: ElementId) : Promise<Graph> {
		const element = await this.repository.getById(id);
		if (!isGraph(element)) {
			throw new Error(`Graph ${id.element} not found`);
		}
		return element;
	}

	async findFlashcardSet(id: ElementId) : Promise<FlashcardSet> {
		const element = await this.repository.getById(id);
		if (!isFlashcardList(element)) {
			throw new Error(`Flashcard set ${id.element} not found`);
		}
		return element;
	}

	async getAllTables(deckId: string) : Promise<Table[]> {
		const all = await this.repository.getAllByType(deckId, "table");
		return filter(all, isTable) as Table[];
	}

	async getAllGraphs(deckId: string) : Promise<Graph[]> {
		const all = await this.repository.getAllByType(deckId, "graph");
		return filter(all, isGraph) as Graph[];
	}

	async getAllFlashcardSets(deckId: string) : Promise<FlashcardSet[]> {
		const all = await this.repository.getAllByType(deckId, "flashcards");
		return filter(all, isFlashcardList) as FlashcardSet[];
	}

	async existAny(deckId: string, type: DeckElementType) : Promise<boolean> {
		return await this.repository.existAnyOfType(deckId, type);
	}

	async setDefaultStartingScore(element: DeckElement,
								  startingScore: number): Promise<void> {
		element.defaultStartingScore = startingScore;
		await this.updateElement(element);
	}

	async setDefaultMaximumScore(deckElement: DeckElement,
								 startingScore: number): Promise<void> {
		deckElement.defaultMaxScore = startingScore;
		await this.updateElement(deckElement);
	}

	async updateElement(element: DeckElement): Promise<DeckElement> {
		return await this.repository.update(element);
	}
}
