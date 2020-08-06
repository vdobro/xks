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

import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import {TableRow} from "../../models/TableRow";
import {TableColumn} from "../../models/TableColumn";
import {FormControl} from "@angular/forms";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.04
 */
@Component({
	selector: 'td [table-cell]',
	templateUrl: './table-cell.component.html',
	styleUrls: ['./table-cell.component.sass']
})
export class TableCellComponent implements OnInit, OnChanges, AfterViewInit {

	@ViewChild('cellInputElement', {static: false})
	cellInputElement: ElementRef;

	@Input()
	row: TableRow;
	@Input()
	newCell: boolean;
	@Input()
	column: TableColumn;

	@Output()
	cellValueChanged = new EventEmitter<string>();

	cellInput = new FormControl('');

	editMode: boolean = false;
	currentValue: string = '';

	constructor() {
	}

	ngOnInit(): void {
		this.updateExistingValue();
		this.editMode = this.newCell;
	}

	ngOnChanges(changes: SimpleChanges) {
		this.updateExistingValue();
		this.editMode = this.newCell;
	}

	switchToEditMode() {
		this.editMode = true;
	}

	async onSubmit() {
		const value = this.cellInput.value.trim();
		if (value === '') {
			return;
		}
		this.currentValue = value;
		this.cellValueChanged.emit(value);
		this.editMode = false;
	}

	private updateExistingValue() {
		if (this.row) {
			this.currentValue = this.row.values.get(this.column.id);
		} else {
			this.currentValue = '';
		}
		this.cellInput.setValue(this.currentValue);
	}

	ngAfterViewInit() {
		if (this.editMode) {
			this.cellInputElement.nativeElement.focus();
		}
	}
}
