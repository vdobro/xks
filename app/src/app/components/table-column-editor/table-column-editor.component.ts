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
import {ConfirmDeleteTableColumnModalComponent} from "../confirm-delete-table-column-modal/confirm-delete-table-column-modal.component";


/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.04
 */
@Component({
	selector: 'table-column-editor',
	templateUrl: './table-column-editor.component.html',
	styleUrls: ['./table-column-editor.component.sass']
})
export class TableColumnEditorComponent implements OnInit {

	@ViewChild('columnNameInput', {static: true})
	columnNameInput: ElementRef;
	@ViewChild(ConfirmDeleteTableColumnModalComponent)
	confirmDeleteColumnModal: ConfirmDeleteTableColumnModalComponent;

	@Input()
	newColumn: boolean;
	@Input()
	leftmostInTable: boolean;
	@Input()
	rightmostInTable: boolean;

	@Input()
	existingColumn: TableColumn = null;
	@Input()
	table: Table;

	@Output()
	nameChanged = new EventEmitter<TableColumn>();
	@Output()
	columnDeleted = new EventEmitter<TableColumn>();

	column: TableColumn;
	nameInput = new FormControl('');

	constructor(private readonly cellService: TableCellService) {
	}

	ngOnInit(): void {
		if (this.existingColumn) {
			this.column = this.existingColumn;
			this.nameInput.setValue(this.column.name);
		}
		this.columnNameInput.nativeElement.focus();
	}

	async onNameSubmit() {
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

	onColumnDelete() {
		this.columnDeleted.emit(this.column);
	}
}
