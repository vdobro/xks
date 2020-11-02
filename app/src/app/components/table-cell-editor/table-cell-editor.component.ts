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
	AfterContentInit,
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
import {FormControl} from "@angular/forms";
import {AlternativeAnswerEditorComponent} from "../alternative-answer-editor/alternative-answer-editor.component";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.04
 */
@Component({
	selector: 'table-cell-editor',
	templateUrl: './table-cell-editor.component.html',
	styleUrls: ['./table-cell-editor.component.sass']
})
export class TableCellEditorComponent implements OnInit, AfterContentInit, OnChanges {

	@ViewChild('cellInputElement', {static: true})
	cellInputElement: ElementRef | undefined;

	@ViewChild(AlternativeAnswerEditorComponent, {static: true})
	alternativeEditor: AlternativeAnswerEditorComponent | undefined;

	cellInput = new FormControl('');

	@Input()
	existingValue: string = '';

	@Input()
	alternativeValues : string[] = [];

	@Output()
	valueSubmitted = new EventEmitter<string>();

	@Output()
	alternativesSubmitted = new EventEmitter<string[]>();

	@Output()
	alternativesInEdit = new EventEmitter<boolean>();

	constructor() {
	}

	ngOnInit(): void {
		this.preloadValue();
	}

	ngAfterContentInit(): void {
		this.cellInputElement?.nativeElement.focus();
	}

	ngOnChanges(changes: SimpleChanges) {
		this.preloadValue();
	}

	onSubmit() {
		const value = this.cellInput.value.trim();
		if (value === '') {
			return;
		}
		this.valueSubmitted.emit(value);
	}

	openAlternativesDialog() {
		this.alternativesInEdit.emit(true);
		this.alternativeEditor?.openModal();
	}

	onAlternativesSubmitted(values: string[]) {
		this.alternativesInEdit.emit(false);
		this.alternativesSubmitted.emit(values);
	}

	private preloadValue() : void {
		this.cellInput.setValue(this.existingValue);
	}

	onAlternativesEditorClosed(): void {
		this.alternativesInEdit.emit(false);
	}
}
