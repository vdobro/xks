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

import {Component, EventEmitter, Input, Output} from '@angular/core';

import {TableColumn} from "@app/models/table-column";
import {Table} from "@app/models/table";
import {TableRow} from "@app/models/table-row";

import {TableElementService} from "@app/services/table-element.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.04
 */
@Component({
	selector: 'tr [table-new-row-editor]',
	templateUrl: './table-new-row-editor.component.html',
	styleUrls: ['./table-new-row-editor.component.sass']
})
export class TableNewRowEditorComponent {

	@Input()
	columns: TableColumn[] = [];
	@Input()
	table: Table | null = null;

	@Output()
	editingStarted = new EventEmitter();
	@Output()
	rowCompleted = new EventEmitter<TableRow>();
	@Output()
	rowUpdated = new EventEmitter();

	rowInEditing: TableRow | null = null;
	newColumnIndex: number = 0;

	constructor(private readonly cellService: TableElementService) {
	}

	async onCellSubmitted(value: { default: string, alternatives: string[] },
						  column: TableColumn) {
		if (value.default.length === 0) {
			return;
		}
		if (this.newColumnIndex === 0) {
			await this.initNewRow();
		}
		await this.updateRow(value, column);

		if (this.newColumnIndex === this.columns.length - 1) {
			this.newColumnIndex = 0;
			this.rowCompleted.next(this.rowInEditing!);
			this.rowInEditing = null;
		} else {
			this.newColumnIndex++;
			this.rowUpdated.emit();
		}
	}

	async initNewRow() {
		this.rowInEditing = await this.cellService.createRow(this.table!);
	}

	async updateRow(cellValue: { default: string, alternatives: string[] }, column: TableColumn) {
		this.rowInEditing = await this.cellService.changeCellValue(cellValue,
			this.rowInEditing!, column, this.table!);
	}
}
