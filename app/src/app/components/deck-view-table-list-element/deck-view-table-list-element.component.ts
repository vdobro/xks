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
import {TableService} from "../../services/table.service";
import {Table} from "../../models/Table";
import {FormControl} from "@angular/forms";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.06.11
 */
@Component({
	selector: 'li [deck-elements]',
	templateUrl: './deck-view-table-list-element.component.html',
	styleUrls: ['./deck-view-table-list-element.component.sass']
})
export class DeckViewTableListElement implements OnInit {

	@Input()
	table: Table;

	@Output()
	deleted: EventEmitter<Table> = new EventEmitter<Table>();

	@Output()
	edited: EventEmitter<Table> = new EventEmitter<Table>();

	editMode: boolean = false;
	nameInput = new FormControl('');

	constructor(private tableService: TableService) {
	}

	ngOnInit(): void {
		this.nameInput.setValue(this.table?.name);
	}

	async onDeleteClicked(): Promise<void> {
		await this.tableService.delete(this.table.id);
		this.deleted.emit(this.table);
	}

	onEditClicked(): void {
		this.editMode = true;
	}

	async onChangesSubmit() {
		if (this.table === null) {
			return;
		}
		this.table.name = this.nameInput.value;

		await this.tableService.update(this.table);
		this.edited.emit(this.table);
		this.editMode = false;
	}
}
