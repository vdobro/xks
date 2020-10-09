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
import {TableRepository} from "../repositories/table-repository.service";
import {TableCellService} from "./table-cell.service";
import {TableSessionModeService} from "./table-session-mode.service";
import {Subject, Subscribable} from "rxjs";
import {DeckRepository} from "../repositories/deck-repository.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.07.12
 */
@Injectable({
	providedIn: 'root'
})
export class TableService {

	private readonly _tablesChanged = new Subject<Deck>();
	readonly tablesChanged: Subscribable<Deck> = this._tablesChanged;

	constructor(
		private readonly repository: TableRepository,
		private readonly deckRepository: DeckRepository,
		private readonly cellService: TableCellService,
		private readonly sessionModeService: TableSessionModeService) {
	}

	public async getById(id: string): Promise<Table> {
		return await this.repository.getById(id);
	}

	public async getByDeck(deck: Deck): Promise<Table[]> {
		return await this.repository.getByDeck(deck.id);
	}

	public async anyExistForDeck(deck: Deck): Promise<boolean> {
		return await this.repository.existAnyForDeck(deck.id);
	}

	public async create(deck: Deck, name: string): Promise<Table> {
		const table: Table = {
			id: uuid(),
			deckId: deck.id,
			name: name,
			sessionModeIds: [],
			defaultSessionModeId: null,
		};
		await this.repository.add(table);
		this._tablesChanged.next(deck);
		return table;
	}

	public async delete(id: string) {
		const table = await this.getById(id);
		await this.sessionModeService.deleteAllForTable(table);
		await this.cellService.deleteAllRowsIn(table);
		await this.cellService.deleteAllColumnsIn(table);
		await this.repository.delete(id);
		this._tablesChanged.next(await this.getDeck(table));
	}

	public async deleteAllInDeck(deck: Deck) {
		const tables = await this.getByDeck(deck);
		for (let table of tables) {
			await this.delete(table.id);
		}
		this._tablesChanged.next(deck);
	}

	public async update(table: Table) {
		await this.repository.update(table);
	}

	private async getDeck(table: Table): Promise<Deck> {
		return await this.deckRepository.getById(table.deckId);
	}
}
