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

import {Subject, Subscribable} from "rxjs";
import {v4 as uuid} from 'uuid';
import {Injectable} from '@angular/core';

import {Table} from '@app/models/table';
import {Deck} from '@app/models/deck';
import {ElementId} from "@app/models/element-id";
import {DeckElementService} from "@app/services/deck-element.service";
import {DeckElementType} from "@app/models/deck-element";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.07.12
 */
@Injectable({
	providedIn: 'root'
})
export class TableService {
	private static readonly elementType: DeckElementType = "table";

	private readonly _tablesChanged = new Subject<string>();
	readonly tablesChanged: Subscribable<string> = this._tablesChanged.asObservable();

	private readonly _tableChanged = new Subject<Table>();
	readonly tableChanged = this._tableChanged.asObservable();

	constructor(
		private readonly deckElementService: DeckElementService) {
		this.tableChanged.subscribe((table) => this._tablesChanged.next(table.deckId));
	}

	public async getById(id: ElementId): Promise<Table> {
		return await this.deckElementService.findTable(id);
	}

	async getByDeckId(deckId: string): Promise<Table[]> {
		return await this.deckElementService.getAllTables(deckId);
	}

	public async getByDeck(deck: Deck): Promise<Table[]> {
		return await this.getByDeckId(deck.id);
	}

	public async anyExistForDeck(deck: Deck): Promise<boolean> {
		return await this.deckElementService.existAny(deck.id, TableService.elementType);
	}

	public async create(deck: Deck, name: string): Promise<void> {
		const table: Table = {
			id: uuid(),
			deckId: deck.id,
			name: name,
			sessionModes: [],
			defaultSessionModeId: null,
			defaultStartingScore: 3,
			defaultMaxScore: 8,
			columns: [],
			rows: []
		};
		await this.deckElementService.add(table, TableService.elementType);
		this._tablesChanged.next(deck.id);
	}

	public async delete(id: ElementId): Promise<void> {
		await this.deckElementService.delete(id);
		this._tablesChanged.next(id.deck);
	}

	public async update(table: Table): Promise<Table> {
		const result = await this.deckElementService.updateElement(table) as Table;
		this._tableChanged.next(result);
		return result;
	}
}
