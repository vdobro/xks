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
import {Subject, Subscribable} from "rxjs";
import {TableRepository} from "../repositories/table-repository.service";
import {TableSessionModeService} from "./table-session-mode.service";
import {AnswerValueService} from "./answer-value.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.03
 */
@Injectable({
	providedIn: 'root'
})
export class TableCellService {

	private readonly _rowCountChanged = new Subject<Table>();
	private readonly _columnsChanged = new Subject<Table>();

	readonly rowCountChanged: Subscribable<Table> = this._rowCountChanged;
	readonly columnsChanged: Subscribable<Table> = this._columnsChanged;

	constructor(
		private readonly rowRepository: TableRowRepository,
		private readonly columnRepository: TableColumnRepository,
		private readonly tableRepository: TableRepository,
		private readonly sessionModeService: TableSessionModeService,
		private readonly answerService: AnswerValueService,
	) {
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
		this._columnsChanged.next(table);
		return column;
	}

	async updateColumn(column: TableColumn) {
		await this.columnRepository.update(column);
		this._columnsChanged.next(await this.tableRepository.getById(column.tableId));
	}

	async createRow(table: Table): Promise<TableRow> {
		const allRows = await this.getRows(table);
		const allColumns = await this.getColumns(table);
		const values = new Map<string, string>();
		for(let column of allColumns) {
			const answer = await this.answerService.create('');
			values.set(column.id, answer.id);
		}
		const row : TableRow = {
			id: uuid(),
			tableId: table.id,
			index: allRows.length,
			valueIds: values
		};
		await this.rowRepository.add(row);
		this._rowCountChanged.next(table);
		return row;
	}

	async changeCellValue(cellValue: { default: string, alternatives: string[] },
						  row: TableRow, column: TableColumn): Promise<TableRow> {
		const answer = await this.answerService.getForCell(row, column);
		await this.answerService.set(cellValue.default, answer);
		await this.answerService.setAlternatives(cellValue.alternatives, answer);
		return row;
	}

	async deleteAllRowsIn(table: Table) {
		await this.rowRepository.deleteAllInTable(table);
		this._rowCountChanged.next(table);
	}

	async deleteRow(row: TableRow) {
		await this.rowRepository.delete(row.id);
		for (let value of row.valueIds.values()) {
			await this.answerService.delete(value);
		}
		this._rowCountChanged.next(await this.tableRepository.getById(row.tableId));
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
			await this.answerService.delete(row.valueIds.get(column.id)!!);
			row.valueIds.delete(column.id);
			await this.rowRepository.update(row);
		}
		const table = await this.tableRepository.getById(column.tableId);
		await this.sessionModeService.deleteAllWithColumn(table, column.id);
		await this.columnRepository.delete(column.id);
		const oldIndex = column.index;
		const columns = await this.getColumns(table);
		for (let remainingColumn of columns) {
			if (remainingColumn.index > oldIndex) {
				remainingColumn.index--;
				await this.updateColumn(remainingColumn);
			}
		}
		this._columnsChanged.next(await this.tableRepository.getById(column.tableId));
	}

	async deleteAllColumnsIn(table: Table) {
		await this.columnRepository.deleteAllInTable(table);
		this._columnsChanged.next(table);
	}

	private async appendColumnToRow(row: TableRow, column: TableColumn): Promise<void> {
		const cellValue = await this.answerService.create('');
		row.valueIds.set(column.id, cellValue.id);
		await this.rowRepository.update(row);
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

