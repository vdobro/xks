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
import arrayMove from "array-move";
import {Subject, Subscribable} from "rxjs";

import {Injectable} from '@angular/core';

import {Table} from "@app/models/Table";
import {TableColumn} from "@app/models/TableColumn";
import {TableRow, TableRowValue} from "@app/models/TableRow";

import {TableSessionModeService} from "@app/services/table-session-mode.service";
import {TableService} from "@app/services/table.service";
import {find, findIndex, remove} from "lodash-es";
import {ElementId} from "@app/models/ElementId";
import {AnswerValue} from "@app/models/AnswerValue";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.03
 */
@Injectable({
	providedIn: 'root'
})
export class TableElementService {

	private readonly _rowCountChanged = new Subject<Table>();
	private readonly _columnsChanged = new Subject<Table>();

	readonly rowCountChanged: Subscribable<Table> = this._rowCountChanged;
	readonly columnsChanged: Subscribable<Table> = this._columnsChanged;

	constructor(
		private readonly tableService: TableService,
		private readonly sessionModeService: TableSessionModeService,
	) {
	}

	findColumn(id: string, table: Table): TableColumn {
		const column = find(table.columns, col => col.id === id);
		if (!column) {
			throw new Error(`Column ${id} in table ${table.id} not found`);
		}
		return column;
	}

	findRow(id: string, table: Table): TableRow {
		const row = find(table.rows, row => row.id === id);
		if (!row) {
			throw new Error(`Row ${id} in table ${table.id} not found`);
		}
		return row;
	}

	getCell(row: TableRow, column: TableColumn): TableRowValue {
		const value = find(row.columnValues, cell => cell.columnId === column.id);
		if (!value) {
			throw new Error(`Table cell not found`);
		}
		return value;
	}

	async addColumn(name: string, table: Table): Promise<TableColumn> {
		const column = {
			id: uuid(),
			tableId: table.id,
			name: name,
			index: table.columns.length
		};
		for (const row of table.rows) {
			row.columnValues.push({
				columnId: column.id,
				value: {
					default: '', alternatives: []
				}
			});
		}
		table.columns.push(column);
		await this.tableService.update(table);

		this._columnsChanged.next(table);
		return column;
	}

	async updateColumn(column: TableColumn, tableId: ElementId) {
		const table = await this.tableService.getById(tableId);
		const columnIndex = findIndex(table.columns, col => col.id === column.id);
		if (columnIndex === -1) {
			throw new Error("Could not update column");
		}
		table.columns[columnIndex] = column;
		const updatedTable = await this.tableService.update(table);
		this._columnsChanged.next(updatedTable);
	}

	async createRow(table: Table): Promise<TableRow> {
		const row : TableRow = {
			id: uuid(),
			columnValues: table.columns.map(col => ({
				columnId: col.id, value: {
					default: '', alternatives: []
				}
			}))
		};
		table.rows.push(row);
		await this.tableService.update(table);
		this._rowCountChanged.next(table);
		return row;
	}

	async changeCellValue(cellValue: AnswerValue,
						  row: TableRow,
						  column: TableColumn,
						  table: Table): Promise<TableRow> {
		const cell = this.getCell(row, column);
		cell.value = cellValue;
		await this.tableService.update(table);
		return row;
	}

	async deleteAllRowsIn(table: Table) {
		table.rows = [];
		this._rowCountChanged.next(await this.tableService.update(table));
	}

	async deleteRow(row: TableRow, table: Table) {
		remove(table.rows, x => x.id === row.id);
		this._rowCountChanged.next(await this.tableService.update(table));
	}

	async moveColumn(oldIndex: number, newIndex: number, table: Table) {
		const rows = table.rows;
		arrayMove.mutate(rows, oldIndex, newIndex);
		await this.tableService.update(table);
	}

	async moveRow(oldIndex: number, newIndex: number, table: Table) {
		const rows = table.rows;
		arrayMove.mutate(rows, oldIndex, newIndex);
		await this.tableService.update(table);
	}

	async deleteColumn(column: TableColumn, table: Table) {
		const rows = table.rows;
		for (let row of rows) {
			remove(row.columnValues, x => x.columnId === column.id);
		}
		await this.sessionModeService.deleteAllWithColumn(table, column.id);
		remove(table.columns, x => x.id === column.id);
		this._columnsChanged.next(await this.tableService.update(table));
	}

	async deleteAllColumnsIn(table: Table) {
		table.columns = [];
		await this.tableService.update(table);
		this._columnsChanged.next(table);
	}
}

