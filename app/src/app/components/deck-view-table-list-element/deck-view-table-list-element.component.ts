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

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TableService} from "../../services/table.service";
import {Table} from "../../models/Table";
import {FormControl} from "@angular/forms";
import {NavigationService} from "../../services/navigation.service";
import {ConfirmDeleteTableModalComponent} from "../confirm-delete-table-modal/confirm-delete-table-modal.component";
import {TableCellService} from "../../services/table-cell.service";

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

	@ViewChild(ConfirmDeleteTableModalComponent)
	confirmDeleteModal: ConfirmDeleteTableModalComponent;

	@Input()
	table: Table;

	@Output()
	deleted: EventEmitter<Table> = new EventEmitter<Table>();

	@Output()
	edited: EventEmitter<Table> = new EventEmitter<Table>();

	editMode: boolean = false;
	nameInput = new FormControl('');
	rowCount: number;

	constructor(private readonly tableService: TableService,
				private readonly tableCellService: TableCellService,
				private readonly navigationService: NavigationService) {
		this.tableCellService.rowCountChanged.subscribe(async table => {
			if (this.table?.id === table.id) {
				await this.updateRowCount();
			}
		});
	}

	async ngOnInit() {
		this.nameInput.setValue(this.table?.name);
		if (this.table) {
			await this.updateRowCount();
		}
	}

	async onDelete(): Promise<void> {
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

	async onNameClick() {
		await this.navigationService.openTable(this.table.id);
	}

	confirmDeletion() {
		this.confirmDeleteModal.openModal();
	}

	private async updateRowCount() {
		const rows = await this.tableCellService.getRows(this.table);
		this.rowCount = rows.length;
	}
}
