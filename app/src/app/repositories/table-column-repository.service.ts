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
import {TableColumn} from "../models/TableColumn";
import {BaseDataEntity} from "./BaseRepository";
import {Table} from "../models/Table";
import {UserSessionService} from "../services/user-session.service";
import {TableConfiguration} from "../models/TableConfiguration";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.02
 */
@Injectable({
	providedIn: 'root'
})
export class TableColumnRepository extends AbstractRepository<TableColumn, TableColumnDataEntity> {

	constructor(userSessionService: UserSessionService) {
		super('table-column', userSessionService);
	}

	protected resolveRemoteDatabaseName(tableConfig: TableConfiguration): string {
		return tableConfig.tableColumns;
	}

	protected mapToDataEntity(entity: TableColumn): TableColumnDataEntity {
		return {
			_id: entity.id,
			_rev: '',
			tableId: entity.tableId,
			index: entity.index,
			name: entity.name
		}
	}

	protected mapToEntity(entity: TableColumnDataEntity): TableColumn {
		return {
			id: entity._id,
			tableId: entity.tableId,
			index: entity.index,
			name: entity.name
		}
	}

	async getByTable(table: Table): Promise<TableColumn[]> {
		return await this.getByTableId(table.id);
	}

	async getByTableId(tableId: string): Promise<TableColumn[]> {
		const result = await this.getDataEntitiesInTable(tableId);
		return result.map(this.mapToEntity);
	}

	async deleteAllInTable(table: Table) {
		const result = await this.getDataEntitiesInTable(table.id);
		for (let column of result) {
			await this.db.remove(column);
		}
	}

	private async getDataEntitiesInTable(tableId: string): Promise<TableColumnDataEntity[]> {
		await this.checkIndex();
		const result = await this.db.find({
			selector: {
				$and: [
					{tableId: {$eq: tableId}},
					{index: {$exists: true}}
				]
			},
			sort: [{index: 'asc'}, {tableId: 'asc'}]
		})
		return result.docs;
	}

	protected getIndexFields(): string[] {
		return ['index', 'tableId'];
	}
}

interface TableColumnDataEntity extends BaseDataEntity {
	tableId: string;
	index: number;
	name: string;
}
