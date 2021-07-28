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

import {Graph} from "@app/models/Graph";
import {Deck} from "@app/models/Deck";

import {ElementId} from "@app/models/ElementId";
import {DeckElementService} from "@app/services/deck-element.service";
import {DeckElementType} from "@app/models/DeckElement";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.13
 */
@Injectable({
	providedIn: 'root'
})
export class GraphService {

	private static readonly elementType: DeckElementType = "graph";
	private readonly _graphsChanged = new Subject<string>();
	readonly deckGraphsChanged: Subscribable<string> = this._graphsChanged;

	constructor(private readonly repository: DeckElementService) {
	}

	public async getById(id: ElementId): Promise<Graph> {
		return await this.repository.findGraph(id);
	}

	async getByDeckId(deckId: string) : Promise<Graph[]> {
		return await this.repository.getAllGraphs(deckId);
	}

	async getByDeck(deck: Deck): Promise<Graph[]> {
		return await this.getByDeckId(deck.id);
	}

	async anyExistForDeck(deck: Deck): Promise<boolean> {
		return await this.repository.existAny(deck.id, GraphService.elementType);
	}

	async create(deck: Deck, name: string) {
		await this.repository.add({
			id: uuid(),
			deckId: deck.id,
			name: name,
			defaultMaxScore: 5,
			defaultStartingScore: 3
		}, GraphService.elementType);
		this._graphsChanged.next(deck.id);
	}

	public async delete(id: ElementId) {
		await this.repository.delete(id);

		this._graphsChanged.next(id.deck);
	}

	public async deleteAllInDeck(deck: Deck) {
		const tables = await this.getByDeck(deck);
		for (let table of tables) {
			await this.delete({element: table.id, deck: deck.id});
		}
		this._graphsChanged.next(deck.id);
	}

	public async update(graph: Graph) {
		await this.repository.updateElement(graph);
	}

}
