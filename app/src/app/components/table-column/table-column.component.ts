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

import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

import {TableColumn} from "@app/models/TableColumn";
import {Table} from "@app/models/Table";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.07
 */
@Component({
	selector: 'th [app-table-column]',
	templateUrl: './table-column.component.html',
	styleUrls: ['./table-column.component.sass']
})
export class TableColumnComponent implements OnInit {

	@Input()
	table: Table | null = null;
	@Input()
	column: TableColumn | null = null;

	@Output()
	columnChanged = new EventEmitter<TableColumn>();
	@Output()
	columnDeleted = new EventEmitter<TableColumn>();
	@Output()
	editingStarted = new EventEmitter<void>();

	editMode: boolean = false;

	constructor() {
	}

	ngOnInit(): void {
	}

	@HostListener("click")
	onClick() {
		if (!this.editMode) {
			this.editMode = true;
			this.editingStarted.emit();
		}
	}

	@HostListener("document:keydown.escape")
	onEscapeClick(_: KeyboardEvent) {
		this.editMode = false;
	}

	async onNameSubmit(value: string) {
		if (!this.column) {
			return;
		}
		this.column.name = value;
		this.columnChanged.emit(this.column);
		this.editMode = false;
	}

	cancelEditing() {
		this.editMode = false;
	}
}
