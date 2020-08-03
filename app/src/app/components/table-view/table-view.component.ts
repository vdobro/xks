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

import {Component, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Table} from "../../models/Table";
import {TableCellService} from "../../services/table-cell.service";
import {TableColumn} from "../../models/TableColumn";
import {TableRow} from "../../models/TableRow";
import {FormControl} from "@angular/forms";
import {KeyValue} from "@angular/common";

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

	@Input()
	table: Table;

	@Output()
	columns: TableColumn[] = [];

	@Output()
	rows: TableRow[] = [];

	columnInCreation: boolean = false;
	columnNameInput = new FormControl('');
	newRowColumnIndex: number = 0;

	@Output()
	rowInEditing: TableRow;

	readonly indexAscOrder = (a: KeyValue<string, string>, b: KeyValue<string, string>): number => {
		const indexA = this.columns.find(value => value.id === a.key).index;
		const indexB = this.columns.find(value => value.id === b.key).index;

		return indexA > indexB ? 1 : ((indexB > indexA) ? -1 : 0);
	}

	constructor(private tableService: TableCellService) {
	}

	async ngOnInit() {
		await this.reloadAll();
	}

	async ngOnChanges() {
		await this.reloadAll();
	}

	addColumn() {
		this.columnInCreation = true;
	}

	async onTableCreated() {
		await this.tableService.addColumn(this.columnNameInput.value, this.table);
		await this.reloadAll();
		this.columnInCreation = false;
	}

	private async reloadAll() {
		this.columns = await this.tableService.getColumns(this.table);
		this.rows = await this.tableService.getRows(this.table);
	}

	async onNewRowCellValueSubmitted(newRow: TableRow) {
		if (this.newRowColumnIndex === this.columns.length - 1) {
			await this.reloadAll();
			this.newRowColumnIndex = 0;
			this.rowInEditing = null;
		} else {
			this.newRowColumnIndex++;
			this.rowInEditing = newRow;
		}
	}

	getCellAt(row: TableRow, index: number): string {
		return row.values.get(this.columns.find(column => column.index === index).id);
	}
}
