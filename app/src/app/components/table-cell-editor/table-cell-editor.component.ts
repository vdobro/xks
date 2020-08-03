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

import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {TableColumn} from "../../models/TableColumn";
import {TableRow} from "../../models/TableRow";
import {TableCellService} from "../../services/table-cell.service";
import {Table} from "../../models/Table";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.03
 */
@Component({
	selector: 'app-table-cell-editor',
	templateUrl: './table-cell-editor.component.html',
	styleUrls: ['./table-cell-editor.component.sass']
})
export class TableCellEditorComponent implements OnInit {

	@ViewChild('cellInputElement', {static: true})
	cellInputElement: ElementRef;

	cellInput = new FormControl('');

	@Input()
	table: Table;
	@Input()
	column: TableColumn;
	@Input()
	row: TableRow;

	@Output()
	cellSubmitted: EventEmitter<TableRow> = new EventEmitter<TableRow>();

	constructor(private cellService: TableCellService) {
	}

	ngOnInit(): void {
		this.cellInputElement?.nativeElement.focus();
	}

	async onCellValueSubmitted() {
		const value = this.cellInput.value.trim();
		if (value === '') {
			return;
		}
		if (this.column.index == 0) {
			this.row = await this.cellService.createRow(this.table);
		}
		this.row = await this.cellService.changeCellValue(value, this.row, this.column);
		this.cellSubmitted.emit(this.row);
	}
}
