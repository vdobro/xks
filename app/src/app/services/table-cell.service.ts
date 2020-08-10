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
import {AbstractRepository} from "../repositories/AbstractRepository";
import {BaseDataEntity} from "../repositories/BaseRepository";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.03
 */
@Injectable({
	providedIn: 'root'
})
export class TableCellService {

	constructor(private readonly rowRepository: TableRowRepository,
				private readonly columnRepository: TableColumnRepository) {
	}

	async getColumns(table: Table): Promise<TableColumn[]> {
		return await this.columnRepository.getByTable(table);
	}

	async getRows(table: Table): Promise<TableRow[]> {
		return await this.rowRepository.getByTable(table);
	}

	async addColumn(name: string, table: Table): Promise<TableColumn> {
		const allColumns = await this.getColumns(table);
		const column = {
			id: uuid(),
			tableId: table.id,
			name: name,
			index: allColumns.length
		};
		await this.columnRepository.add(column);
		const rows = await this.getRows(table);
		for (const row of rows) {
			await this.appendColumnToRow(row, column);
		}
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

	async deleteAllRowsIn(table: Table) {
		await this.rowRepository.deleteAllInTable(table);
	}

	async deleteRow(row: TableRow) {
		await this.rowRepository.delete(row.id);
	}

	async moveColumn(oldColumn: TableColumn, newIndex: number) {
		const columns = await this.columnRepository.getByTableId(oldColumn.tableId);
		await TableCellService.moveElement(oldColumn, newIndex, columns, this.columnRepository);
	}

	async moveRow(oldRow: TableRow, newIndex: number) {
		const rows = await this.rowRepository.getByTableId(oldRow.tableId);
		await TableCellService.moveElement(oldRow, newIndex, rows, this.rowRepository);
	}

	async deleteColumn(column: TableColumn) {
		const rows = await this.rowRepository.getByTableId(column.tableId);
		for (let row of rows) {
			row.values.delete(column.id);
			await this.rowRepository.update(row);
		}
		await this.columnRepository.delete(column.id);
	}

	async deleteAllColumnsIn(table: Table) {
		await this.columnRepository.deleteAllInTable(table);
	}

	private static async moveElement<T extends { id: string, index: number },
		DT extends BaseDataEntity>(element: T,
								   newIndex: number,
								   allEntities: T[],
								   repository: AbstractRepository<T, DT>) {

		const oldIndex = element.index;
		if (oldIndex === newIndex) return;

		allEntities[oldIndex].index = newIndex;
		if (oldIndex < newIndex) {
			for (let i = oldIndex + 1; i <= newIndex; i++) {
				allEntities[i].index = i - 1;
			}
		} else {
			for (let i = oldIndex - 1; i >= newIndex; i--) {
				allEntities[i].index = i + 1;
			}
		}
		const [begin, end] = oldIndex < newIndex ? [oldIndex, newIndex] : [newIndex, oldIndex];
		const rowsToUpdate = allEntities.slice(begin, end + 1);
		await repository.updateAll(rowsToUpdate);
	}
}

