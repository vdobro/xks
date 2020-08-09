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
import {TableService} from "../../services/table.service";
import {FormControl} from "@angular/forms";

import {Deck} from "../../models/Deck";
import {Table} from "../../models/Table";

import UIkit from 'uikit';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.07.12
 */
@Component({
	selector: 'app-new-table-modal',
	templateUrl: './new-table-modal.component.html',
	styleUrls: ['./new-table-modal.component.sass']
})
export class NewTableModalComponent implements OnInit {

	@ViewChild("newTableModal") modal: ElementRef;
	@Input() deck: Deck;
	@Output() tableCreated: EventEmitter<Table> = new EventEmitter<Table>();

	nameInput = new FormControl('');

	constructor(private tableService: TableService) {
	}

	ngOnInit(): void {
	}

	async onSaveClick() {
		const name = this.nameInput?.value?.trim();
		if (name === null || name === '') {
			return;
		}
		const table = await this.tableService.create(this.deck, this.nameInput.value);

		this.nameInput.reset();
		UIkit.modal(this.modal.nativeElement).hide();
		this.tableCreated.emit(table);
	}

	openDialog() {
		UIkit.modal(this.modal.nativeElement).show();
	}
}
