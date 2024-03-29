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
import {Observable, Subject, Subscribable} from "rxjs";

import {Injectable} from '@angular/core';

import {DeckElementType} from "@app/models/deck-element";
import {Graph} from "@app/models/graph";
import {Deck} from "@app/models/deck";

import {ElementId} from "@app/models/element-id";
import {DeckElementService} from "@app/services/deck-element.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.13
 */
@Injectable({
	providedIn: 'root'
})
export class GraphService {

	private static readonly elementType: DeckElementType = "graph";

	private readonly _graphsChanged: Subject<string> = new Subject<string>();
	readonly graphsChanged: Subscribable<string> = this._graphsChanged.asObservable();

	private readonly _graphChanged: Subject<Graph> = new Subject<Graph>();
	readonly graphChanged: Observable<Graph> = this._graphChanged.asObservable();

	constructor(private readonly deckElementService: DeckElementService) {
		this.graphChanged.subscribe((graph) => this._graphsChanged.next(graph.deckId));
	}

	public async getById(id: ElementId): Promise<Graph> {
		return await this.deckElementService.findGraph(id);
	}

	async getByDeckId(deckId: string) : Promise<Graph[]> {
		return await this.deckElementService.getAllGraphs(deckId);
	}

	async getByDeck(deck: Deck): Promise<Graph[]> {
		return await this.getByDeckId(deck.id);
	}

	async anyExistForDeck(deck: Deck): Promise<boolean> {
		return await this.deckElementService.existAny(deck.id, GraphService.elementType);
	}

	async create(deck: Deck, name: string) : Promise<Graph> {
		const graph : Graph = {
			id: uuid(),
			deckId: deck.id,
			name: name,
			defaultMaxScore: 5,
			defaultStartingScore: 3,
			nodes: [],
			edges: [],
		};
		await this.deckElementService.add(graph, GraphService.elementType);
		this._graphsChanged.next(deck.id);
		return graph;
	}

	public async delete(id: ElementId) : Promise<void> {
		await this.deckElementService.delete(id);

		this._graphsChanged.next(id.deck);
	}

	public async deleteAllInDeck(deck: Deck) : Promise<void> {
		const graphs = await this.getByDeck(deck);
		for (const graph of graphs) {
			await this.delete({element: graph.id, deck: deck.id});
		}
		this._graphsChanged.next(deck.id);
	}

	public async update(graph: Graph) : Promise<Graph> {
		const result = await this.deckElementService.updateElement(graph) as Graph;
		this._graphChanged.next(result);
		return result;
	}
}
