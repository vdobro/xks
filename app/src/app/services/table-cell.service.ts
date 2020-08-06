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
import {TableRowRepository} from "../repositories/table-row-repository.service";
import {TableColumnRepository} from "../repositories/table-column-repository.service";
import {Table} from "../models/Table";
import {TableRow} from "../models/TableRow";
import {TableColumn} from "../models/TableColumn";
import {v4 as uuid} from 'uuid';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.03
 */
@Injectable({
	providedIn: 'root'
})
export class TableCellService {

	constructor(private rowRepository: TableRowRepository,
				private columnRepository: TableColumnRepository) {
	}

	async getColumns(table: Table): Promise<TableColumn[]> {
		return await this.columnRepository.getByTable(table);
	}

	async getRows(table: Table): Promise<TableRow[]> {
		return await this.rowRepository.getByTable(table);
	}

	async addColumn(name: string, table: Table): Promise<TableColumn> {
		const allColumns = await this.columnRepository.getByTable(table);
		const column = {
			id: uuid(),
			tableId: table.id,
			name: name,
			index: allColumns.length
		};
		await this.columnRepository.add(column);
		return column;
	}

	async createRow(table: Table): Promise<TableRow> {
		const allRows = await this.getRows(table);
		const allColumns = await this.getColumns(table);
		const values = new Map<string, string>();
		allColumns.forEach((value: TableColumn) => {
			values.set(value.id, '');
		});
		const row = {
			id: uuid(),
			tableId: table.id,
			index: allRows.length,
			values: values
		}
		await this.rowRepository.add(row);
		return row;
	}

	async appendColumnToRow(row: TableRow, column: TableColumn): Promise<TableRow> {
		row.values.set(column.id, '');
		await this.rowRepository.update(row);
		return row;
	}

	async changeCellValue(cellValue: string, row: TableRow, column: TableColumn): Promise<TableRow> {
		row.values.set(column.id, cellValue);
		await this.rowRepository.update(row);
		return row;
	}

	async deleteRow(row: TableRow) {
		await this.rowRepository.delete(row.id);
	}

	async swapColumns(first: TableColumn, second: TableColumn) {
		[first.index, second.index] = [second.index, first.index];
		await this.columnRepository.update(first);
		await this.columnRepository.update(second);
	}

	async swapRows(first: TableRow, second: TableRow) {
		[first.index, second.index] = [second.index, first.index];
		await this.rowRepository.update(first);
		await this.rowRepository.update(second);
	}

	async deleteColumn(column: TableColumn) {
		await this.columnRepository.delete(column.id);
	}
}

