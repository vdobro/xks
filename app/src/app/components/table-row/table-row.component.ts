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
import {TableRow} from "../../models/TableRow";
import {TableColumn} from "../../models/TableColumn";
import {TableCellService} from "../../services/table-cell.service";

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
	row: TableRow;
	@Input()
	columns: TableColumn[];

	@Output()
	rowDeleted = new EventEmitter<TableRow>();

	constructor(private cellService: TableCellService) {
	}

	ngOnInit(): void {
	}

	async cellChanged(value: string, row: TableRow, column: TableColumn) {
		await this.cellService.changeCellValue(value, row, column);
	}
}
