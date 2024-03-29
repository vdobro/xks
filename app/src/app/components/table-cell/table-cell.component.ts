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

import {Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import {TableRow} from "@app/models/table-row";
import {TableColumn} from "@app/models/table-column";

import {TableElementService} from "@app/services/table-element.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.04
 */
@Component({
	selector: 'td [table-cell]',
	templateUrl: './table-cell.component.html',
	styleUrls: ['./table-cell.component.sass']
})
export class TableCellComponent implements OnInit, OnChanges {

	@Input()
	newCell: boolean = false;
	@Input()
	row: TableRow | null = null;
	@Input()
	column: TableColumn | null = null;

	@Output()
	cellValueChanged = new EventEmitter<{ default: string, alternatives: string[] }>();
	@Output()
	editingStarted = new EventEmitter();
	@Output()
	editingStopped = new EventEmitter();

	editMode: boolean = false;
	currentValue: string = '';
	currentAlternatives: string[] = [];
	allowLoseFocus: boolean = true;

	constructor(private readonly cellService: TableElementService) {
	}

	async ngOnInit(): Promise<void> {
		await this.updateExistingValue();
		this.editMode = this.newCell;
	}

	async ngOnChanges(changes: SimpleChanges) {
		await this.updateExistingValue();
		this.editMode = this.newCell;
	}

	@HostListener("click")
	onClick() {
		this.editMode = true;
		this.editingStarted.emit();
	}

	@HostListener("document:keydown.escape")
	onEscapeClick(_: KeyboardEvent) {
		this.cancelEditingIfExisting();
	}

	async onSubmit(value: string) {
		this.currentValue = value;
		this.emitCurrent();
		this.editMode = false;
	}

	async onAlternativeSubmit(alternativeValues: string[]) {
		this.currentAlternatives = alternativeValues;
		this.emitCurrent();
	}

	private emitCurrent() {
		this.cellValueChanged.emit({
			default: this.currentValue,
			alternatives: this.currentAlternatives
		});
	}

	private updateExistingValue() {
		const row = this.row;
		const column = this.column;

		if (!row || !column) {
			this.currentValue = '';
			return;
		}
		const cell = this.cellService.getCell(row, column);
		if (cell) {
			this.currentValue = cell.value.default;
			this.currentAlternatives = cell.value.alternatives;
		}
	}

	cancelEditingIfExisting() {
		if (!this.newCell && this.allowLoseFocus && this.currentValue.length > 0) {
			setTimeout(() => {
				this.editMode = false;
				this.editingStopped.emit();
			}, 100);
		}
	}

	onAlternativesEditorStatusChange(dialogVisible: boolean) {
		this.allowLoseFocus = !dialogVisible;
		if (this.row && this.column) {
			const oldValue = this.cellService.getCell(this.row, this.column);
			if (this.currentValue === oldValue.value.default) {
				this.cancelEditingIfExisting();
			}
		}
	}
}
