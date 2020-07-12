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

import {v4 as uuid} from 'uuid';
import {Table} from "../models/Table";
import {Deck} from "../models/Deck";
import {MockData} from "./mock-data";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.07.12
 */
@Injectable({
	providedIn: 'root'
})
export class TableService {

	private tables : Table[] = MockData.sampleTables;

	constructor() {
	}

	public getById(id: string) : Table {
		const results = this.tables.filter(x => x.id === id);
		return results[0];
	}

	public getByDeck(deck: Deck) : Table[] {
		return this.tables.filter(x => x.deckId === deck.id);
	}

	public create(deck: Deck, name: string) : Table {
		const table : Table = {
			id: uuid(),
			deckId: deck.id,
			name: name,
			columns: [],
			rows: []
		};
		this.tables.push(table);
		return table;
	}

	public delete(id: string) {
		this.tables = this.tables.filter(item => item.id !== id);
	}

	public update(table: Table) {
		//TODO
	}
}
