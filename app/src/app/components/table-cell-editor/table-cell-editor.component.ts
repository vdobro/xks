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

import {AfterContentInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.04
 */
@Component({
	selector: 'table-cell-editor',
	templateUrl: './table-cell-editor.component.html',
	styleUrls: ['./table-cell-editor.component.sass']
})
export class TableCellEditorComponent implements OnInit, AfterContentInit {

	@ViewChild('cellInputElement', {static: true})
	cellInputElement: ElementRef;

	cellInput = new FormControl('');

	@Input()
	existingValue: string;

	@Output()
	valueSubmitted = new EventEmitter<string>();

	constructor() {
	}

	ngOnInit(): void {
		this.cellInput.setValue(this.existingValue);
	}

	ngAfterContentInit(): void {
		this.cellInputElement.nativeElement.focus();
	}

	onSubmit() {
		const value = this.cellInput.value.trim();
		if (value === '') {
			return;
		}
		this.valueSubmitted.emit(value);
	}
}
