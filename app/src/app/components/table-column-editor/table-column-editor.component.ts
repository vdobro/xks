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
import {TableColumn} from "../../models/TableColumn";
import {FormControl} from "@angular/forms";
import {TableCellService} from "../../services/table-cell.service";
import {Table} from "../../models/Table";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.04
 */
@Component({
	selector: 'app-table-column-editor',
	templateUrl: './table-column-editor.component.html',
	styleUrls: ['./table-column-editor.component.sass']
})
export class TableColumnEditorComponent implements OnInit {

	@ViewChild('columnNameInput', {static: true})
	columnNameInput: ElementRef;

	@Input()
	table: Table;

	@Output()
	nameChanged = new EventEmitter<TableColumn>();

	column: TableColumn;
	nameInput = new FormControl('');

	constructor(private cellService: TableCellService) {
	}

	ngOnInit(): void {
		this.columnNameInput.nativeElement.focus();
	}

	async onCreated() {
		const name = this.nameInput.value.trim();
		if (name === '') {
			return;
		}
		if (this.column) {
			this.column.name = name;
		} else {
			this.column = await this.cellService.addColumn(name, this.table);
		}
		this.nameChanged.emit(this.column);
	}
}
