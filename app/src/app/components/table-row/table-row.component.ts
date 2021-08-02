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

import {AnswerValue} from "@app/models/answer-value";
import {Table} from "@app/models/Table";
import {TableRow} from "@app/models/TableRow";
import {TableColumn} from "@app/models/TableColumn";

import {TableElementService} from "@app/services/table-element.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.08
 */
@Component({
	selector: 'tr [table-row]',
	templateUrl: './table-row.component.html',
	styleUrls: ['./table-row.component.sass']
})
export class TableRowComponent implements OnInit {

	@Input()
	row: TableRow | null = null;
	@Input()
	table: Table | null = null;

	@Output()
	rowDeleted = new EventEmitter<TableRow>();
	@Output()
	editingStarted = new EventEmitter();
	@Output()
	editingStopped = new EventEmitter();

	constructor(private readonly cellService: TableElementService) {
	}

	ngOnInit(): void {
	}

	async cellChanged(value: AnswerValue, row: TableRow, column: TableColumn) {
		if (!this.table) {
			return;
		}

		await this.cellService.changeCellValue(value, row, column, this.table);
		this.editingStopped.emit();
	}
}
