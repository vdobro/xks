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

import {Injectable} from '@angular/core';
import {Deck} from "../models/Deck";
import {Subject, Subscribable} from "rxjs";
import {GraphRepository} from "../repositories/graph-repository.service";
import {Graph} from "../models/Graph";
import {DeckRepository} from "../repositories/deck-repository.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.13
 */
@Injectable({
	providedIn: 'root'
})
export class GraphService {

	private readonly _graphsChanged = new Subject<Deck>();
	readonly graphsChanged: Subscribable<Deck> = this._graphsChanged;

	constructor(private readonly repository: GraphRepository,
				private readonly deckRepository: DeckRepository) {
	}

	public async getById(id: string): Promise<Graph> {
		return await this.repository.getById(id);
	}

	async getByDeck(deck: Deck): Promise<Graph[]> {
		return this.repository.getByDeck(deck.id);
	}

	async anyExistForDeck(deck: Deck): Promise<boolean> {
		return this.repository.existAnyForDeck(deck.id);
	}

	async create(deck: Deck, name: string) {
		await this.repository.add({
			deckId: deck.id,
			id: uuid(),
			name: name
		});
		this._graphsChanged.next(deck);
	}

	public async delete(id: string) {
		const graph = await this.getById(id);
		await this.repository.delete(id);
		//TODO Delete related entities here

		this._graphsChanged.next(await this.getDeck(graph));
	}

	public async deleteAllInDeck(deck: Deck) {
		const tables = await this.getByDeck(deck);
		for (let table of tables) {
			await this.delete(table.id);
		}
		this._graphsChanged.next(deck);
	}

	public async update(graph: Graph) {
		await this.repository.update(graph);
	}

	private async getDeck(graph: Graph): Promise<Deck> {
		return await this.deckRepository.getById(graph.deckId);
	}
}
