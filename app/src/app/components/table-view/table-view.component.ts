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

import {Component, OnChanges, OnInit, Output} from '@angular/core';
import {Table} from "../../models/Table";
import {TableCellService} from "../../services/table-cell.service";
import {TableColumn} from "../../models/TableColumn";
import {TableRow} from "../../models/TableRow";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {TableRowComponent} from "../table-row/table-row.component";
import {TableColumnComponent} from "../table-column/table-column.component";
import {ActivatedRoute} from "@angular/router";
import {TableService} from "../../services/table.service";
import {DeckService} from "../../services/deck.service";
import {NavigationControlService} from "../../services/navigation-control.service";
import {NavigationService} from "../../services/navigation.service";

export const TABLE_ID_PARAM: string = 'tableId';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.03
 */
@Component({
	selector: 'app-table-view',
	templateUrl: './table-view.component.html',
	styleUrls: ['./table-view.component.sass']
})
export class TableViewComponent implements OnInit, OnChanges {

	columns: TableColumn[] = [];
	rows: TableRow[] = [];

	@Output()
	columnInCreation: boolean = false;
	@Output()
	newRowColumnIndex: number = 0;
	@Output()
	showColumnSwapControls: boolean;

	table: Table;

	constructor(private readonly tableService: TableService,
				private readonly deckService: DeckService,
				private readonly cellService: TableCellService,
				private readonly navigationControlService: NavigationControlService,
				private readonly navigationService: NavigationService,
				private readonly activatedRoute: ActivatedRoute) {
	}

	async ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			this.table = await this.tableService.getById(params.get(TABLE_ID_PARAM));
			if (this.table) {
				await this.navigationControlService.selectTable(this.table);
				await this.reloadAll();
			} else {
				await this.navigationService.goToDeckList();
			}
		});
	}

	async ngOnChanges() {
		await this.reloadAll();
	}

	addColumn() {
		this.columnInCreation = true;
	}

	async columnAdded() {
		if (this.rows.length > 1) {
			await this.reloadAll();
		} else {
			await this.reloadColumns();
		}
		this.columnInCreation = false;
	}

	rowAdded(row: TableRow) {
		this.rows.push(row);
	}

	async deleteColumn(column: TableColumn) {
		if (this.columns.length === 1) {
			await this.cellService.deleteAllRowsIn(this.table);
		}
		await this.cellService.deleteColumn(column);
		await this.reloadAll();
	}

	async deleteRow(row: TableRow) {
		await this.cellService.deleteRow(row);
		await this.reloadRows();
	}

	private async reloadAll() {
		if (this.table) {
			await this.reloadColumns();
			await this.reloadRows();
		}
	}

	private async reloadColumns() {
		this.columns = await this.cellService.getColumns(this.table);
	}

	private async reloadRows() {
		this.rows = await this.cellService.getRows(this.table);
	}

	async dropRow(event: CdkDragDrop<TableViewComponent, TableRowComponent>) {
		const row = this.rows.splice(event.previousIndex, 1)[0];
		this.rows.splice(event.currentIndex, 0, row);
		await this.cellService.moveRow(row, event.currentIndex);
		await this.reloadAll();
	}

	async dropColumn(event: CdkDragDrop<TableViewComponent, TableColumnComponent>) {
		const column = this.columns.splice(event.previousIndex, 1)[0];
		this.columns.splice(event.currentIndex, 0, column);
		await this.cellService.moveColumn(column, event.currentIndex);
		await this.reloadAll();
	}

	async columnChanged(column: TableColumn) {
		await this.cellService.updateColumn(column);
	}
}
