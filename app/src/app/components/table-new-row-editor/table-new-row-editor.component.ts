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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableColumn} from "../../models/TableColumn";
import {Table} from "../../models/Table";
import {TableRow} from "../../models/TableRow";
import {TableCellService} from "../../services/table-cell.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.04
 */
@Component({
	selector: 'tr [table-new-row-editor]',
	templateUrl: './table-new-row-editor.component.html',
	styleUrls: ['./table-new-row-editor.component.sass']
})
export class TableNewRowEditorComponent implements OnInit {

	@Input()
	columns: TableColumn[] = [];
	@Input()
	table: Table | null = null;

	@Output()
	editingStarted = new EventEmitter();
	@Output()
	newRow = new EventEmitter<TableRow>();

	rowInEditing: TableRow | null = null;
	newColumnIndex: number = 0;

	constructor(private readonly cellService: TableCellService) {
	}

	async ngOnInit() {
	}

	async onCellSubmitted(value: { default: string, alternatives: string[] },
						  column: TableColumn) {
		if (this.newColumnIndex === 0) {
			await this.initNewRow();
		}
		await this.updateRow(value, column);

		if (value.default.length === 0) {
			return;
		}
		if (this.newColumnIndex === this.columns.length - 1) {
			this.newColumnIndex = 0;
			this.newRow.next(this.rowInEditing!!);
			this.rowInEditing = null;
		} else {
			this.newColumnIndex++;
		}
	}

	async initNewRow() {
		this.rowInEditing = await this.cellService.createRow(this.table!!);
	}

	async updateRow(cellValue: { default: string, alternatives: string[] }, column: TableColumn) {
		this.rowInEditing = await this.cellService.changeCellValue(cellValue,
			this.rowInEditing!!, column);
	}
}
