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
	@Output()
	rowInEditing: TableRow;
	@Output()
	columnInCreation: boolean = false;
	@Output()
	newRowColumnIndex: number = 0;

	constructor(private cellService: TableCellService) {
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

	async columnAdded(column: TableColumn) {
		for (const value of this.rows) {
			await this.cellService.appendColumnToRow(value, column);
		}
		if (this.rows.length > 1) {
			await this.reloadAll();
		} else {
			this.columns = await this.cellService.getColumns(this.table);
		}
		this.columnInCreation = false;
	}

	rowAdded(row: TableRow) {
		this.rows.push(row);
	}

	private async reloadAll() {
		this.columns = await this.cellService.getColumns(this.table);
		this.rows = await this.cellService.getRows(this.table);
	}
}
