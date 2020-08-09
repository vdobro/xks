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
import {AbstractRepository} from "./AbstractRepository";
import {TableRow} from "../models/TableRow";
import {BaseDataEntity} from "./BaseRepository";
import {Table} from "../models/Table";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.03
 */
@Injectable({
	providedIn: 'root'
})
export class TableRowRepository extends AbstractRepository<TableRow, TableRowDataEntity> {

	private indexCreated: boolean = false;

	constructor() {
		super('table-row');
	}

	mapToDataEntity(entity: TableRow): TableRowDataEntity {
		const values = {};
		entity.values.forEach((value, key) => {
			values[key] = value;
		});
		return {
			_id: entity.id,
			_rev: '',
			values: JSON.stringify(values),
			index: entity.index,
			tableId: entity.tableId
		}
	}

	mapToEntity(entity: TableRowDataEntity): TableRow {
		const values = new Map<string, string>();
		for (let [key, value] of Object.entries(JSON.parse(entity.values))) {
			values.set(key, value as string);
		}
		return {
			id: entity._id,
			values: values,
			index: entity.index,
			tableId: entity.tableId
		}
	}

	async getByTable(table: Table): Promise<TableRow[]> {
		return await this.getByTableId(table.id);
	}

	async getByTableId(tableId: string): Promise<TableRow[]> {
		const result = await this.getDataEntitiesByTable(tableId);
		return result.map(this.mapToEntity);
	}

	async getInIndexRange(tableId: string, from: number, to: number): Promise<TableRow[]> {
		await this.checkIndexesInitialized();
		const results = await this.db.find({
			selector: {
				$and: [
					{tableId: {$eq: tableId}},
					{index: {$gte: from, $lte: to}}
				]
			},
			sort: [{index: 'asc'}, {tableId: 'asc'}]
		});
		return results.docs.map(this.mapToEntity);
	}

	async deleteAllInTable(table: Table) {
		const all = await this.getDataEntitiesByTable(table.id);
		for (const row of all) {
			await this.db.remove(row);
		}
	}

	private async checkIndexesInitialized(): Promise<void> {
		if (this.indexCreated) {
			return;
		}
		await this.db.createIndex({
			index: {fields: ['index', 'tableId']}
		});
		this.indexCreated = true;
	}

	private async getDataEntitiesByTable(tableId: string): Promise<TableRowDataEntity[]> {
		await this.checkIndexesInitialized();
		const results = await this.db.find({
			selector: {
				$and: [
					{tableId: {$eq: tableId}},
					{index: {$exists: true}}
				]
			},
			sort: [{index: 'asc'}, {tableId: 'asc'}]
		})
		return results.docs;
	}
}

export interface TableRowDataEntity extends BaseDataEntity {
	tableId: string,
	index: number,
	values: string
}
