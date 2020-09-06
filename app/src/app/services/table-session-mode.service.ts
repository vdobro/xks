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
import {TableSessionModeRepository} from "../repositories/table-session-mode-repository.service";
import {Table} from "../models/Table";
import {TableColumn} from "../models/TableColumn";
import {TableSessionMode} from "../models/TableSessionMode";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.06
 */
@Injectable({
	providedIn: 'root'
})
export class TableSessionModeService {

	constructor(
		private readonly repository: TableSessionModeRepository) {
	}

	async getAllIn(table: Table) {
		return await this.repository.getByTable(table);
	}

	async create(table: Table,
				 questionColumns: TableColumn[],
				 answerColumns: TableColumn[]): Promise<TableSessionMode> {
		const questionColumnIds = questionColumns.map(column => column.id);
		const answerColumnIds = answerColumns.map(column => column.id);

		const existing = await this.repository.getByTable(table);
		const duplicate = existing.find(mode =>
			this.unorderedArraysEqual(mode.questionColumnIds, questionColumnIds)
			&& this.unorderedArraysEqual(mode.answerColumnIds, answerColumnIds));
		if (duplicate) {
			return duplicate;
		}
		const entity: TableSessionMode = {
			id: uuid(),
			tableId: table.id,
			questionColumnIds: questionColumnIds,
			answerColumnIds: answerColumnIds,
		};
		await this.repository.add(entity);
		return entity;
	}

	async deleteAllForTable(table: Table) {
		const all = await this.repository.getByTable(table);
		await Promise.all(all.map(mode => this.repository.delete(mode.id)));
	}

	private unorderedArraysEqual<T>(first: T[], second: T[]): boolean {
		return first.length === second.length
			&& first.every(value => second.findIndex(x => x === value) !== -1);
	}
}
