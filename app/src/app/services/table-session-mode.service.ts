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
import {Subject} from "rxjs";
import {find, remove} from "lodash-es";

import {Injectable} from '@angular/core';

import {Table} from "@app/models/Table";
import {TableColumn} from "@app/models/TableColumn";
import {TableSessionMode} from "@app/models/TableSessionMode";

import {TableService} from "@app/services/table.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.06
 */
@Injectable({
	providedIn: 'root'
})
export class TableSessionModeService {

	private readonly _sessionModesChanged = new Subject<Table>();
	readonly $modesChanged = this._sessionModesChanged.asObservable();

	constructor(private readonly tableService: TableService) {
	}

	async create(table: Table,
				 questionColumns: TableColumn[],
				 answerColumns: TableColumn[]): Promise<TableSessionMode> {
		const questionColumnIds = questionColumns.map(column => column.id);
		const answerColumnIds = answerColumns.map(column => column.id);

		const duplicate = table.sessionModes.find(mode =>
			this.unorderedArraysEqual(mode.questionColumnIds, questionColumnIds)
			&& this.unorderedArraysEqual(mode.answerColumnIds, answerColumnIds));
		if (duplicate) {
			return duplicate;
		}
		const entity: TableSessionMode = {
			id: uuid(),
			questionColumnIds: questionColumnIds,
			answerColumnIds: answerColumnIds,
		};
		table.sessionModes.push(entity);
		await this.tableService.update(table);
		this._sessionModesChanged.next(table);
		return entity;
	}

	getById(id: string, table: Table): TableSessionMode {
		const mode = find(table.sessionModes, mode => mode.id === id);
		if (!mode) {
			throw new Error(`Session mode ${id} not found`);
		}
		return mode;
	}

	private unorderedArraysEqual<T>(first: T[], second: T[]): boolean {
		return first.length === second.length
			&& first.every(value => find(second, x => x === value) !== undefined);
	}

	async setAsDefault(mode: TableSessionMode, table: Table): Promise<void> {
		table.defaultSessionModeId = mode.id;
		await this.tableService.update(table);
	}

	async deleteAllWithColumn(table: Table, columnId: string): Promise<void> {
		if (!columnId) {
			return;
		}
		const all = table.sessionModes;
		let shouldUpdate = false;
		for (let mode of all) {
			if (mode.answerColumnIds.find(id => columnId === id) || mode.questionColumnIds.find(id => columnId === id)) {
				if (mode.id === table.defaultSessionModeId) {
					table.defaultSessionModeId = null;
				}
				remove(all, x => x.id === mode.id);
				shouldUpdate = true;
			}
		}
		if (shouldUpdate) {
			await this.tableService.update(table);
		}
	}
}
