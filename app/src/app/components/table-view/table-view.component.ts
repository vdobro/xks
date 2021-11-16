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

import {Component, OnInit, Output} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {CdkDragDrop} from "@angular/cdk/drag-drop";

import {Table} from "@app/models/Table";
import {TableColumn} from "@app/models/TableColumn";
import {TableRow} from "@app/models/TableRow";

import {TableService} from "@app/services/table.service";
import {DeckService} from "@app/services/deck.service";
import {TableElementService} from "@app/services/table-element.service";
import {NavigationControlService} from "@app/services/navigation-control.service";
import {NavigationService} from "@app/services/navigation.service";
import {SidebarService} from "@app/services/sidebar.service";
import {TopBarService} from "@app/services/top-bar.service";

import {TableRowComponent} from "@app/components/table-row/table-row.component";
import {TableColumnComponent} from "@app/components/table-column/table-column.component";
import {DECK_ID_PARAM} from "@app/components/deck-view/deck-view.component";

export const TABLE_ID_PARAM: string = 'tableId';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.03
 */
@Component({
	selector: 'app-table-view',
	templateUrl: './table-view.component.html',
	styleUrls: ['./table-view.component.sass']
})
export class TableViewComponent implements OnInit {

	@Output()
	columnInCreation: boolean = false;
	@Output()
	newRowColumnIndex: number = 0;
	@Output()
	showColumnSwapControls: boolean = false;

	columnDragEnabled: boolean = true;
	rowDragEnabled: boolean = true;
	excludeLastRow: boolean = false;

	table: Table | null = null;
	rows : TableRow[] = [];

	constructor(private readonly tableService: TableService,
				private readonly deckService: DeckService,
				private readonly cellService: TableElementService,
				private readonly sidebarService: SidebarService,
				private readonly topBarService: TopBarService,
				private readonly navigationControlService: NavigationControlService,
				private readonly navigationService: NavigationService,
				private readonly activatedRoute: ActivatedRoute) {
	}

	async ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async (params: ParamMap) => {
			const id = params.get(TABLE_ID_PARAM);
			const deckId = params.get(DECK_ID_PARAM);
			this.table = (id && deckId) ? await this.tableService.getById({element: id, deck: deckId}) : null;

			if (this.table) {
				await this.sidebarService.selectDeckElement(this.table);
				this.reloadRows();
			} else {
				await this.navigationService.goToDeckList();
			}
		});
		this.topBarService.clearItems();
		this.topBarService.setBackButtonLabel('Back to deck');
	}

	addColumn() {
		this.columnInCreation = true;
	}

	async columnAdded() {
		this.columnDragEnabled = true;
		if (!this.table) {
			return;
		}
		this.columnInCreation = false;
	}

	async deleteColumn(column: TableColumn) {
		if (this.table!.columns.length === 1) {
			await this.cellService.deleteAllRowsIn(this.table!);
		}
		await this.cellService.deleteColumn(column, this.table!);
	}

	async deleteRow(row: TableRow) {
		await this.cellService.deleteRow(row, this.table!);
		this.reloadRows();
	}

	async dropRow(event: CdkDragDrop<TableViewComponent, TableRowComponent>) {
		await this.cellService.moveRow(event.previousIndex, event.currentIndex, this.table!);
		this.reloadRows();
	}

	async dropColumn(event: CdkDragDrop<TableViewComponent, TableColumnComponent>) {
		await this.cellService.moveColumn(event.previousIndex, event.currentIndex, this.table!);
	}

	async columnChanged(column: TableColumn) {
		this.columnDragEnabled = true;
		if (!this.table) {
			return;
		}
		await this.cellService.updateColumn(column, {element: this.table.id, deck: this.table.deckId});
	}

	cancelColumnCreation() {
		setTimeout(() => {
			this.columnInCreation = false;
			this.columnDragEnabled = true;
		}, 100);
	}

	disableColumnDrag() {
		this.columnDragEnabled = false;
	}

	disableRowDrag() {
		this.rowDragEnabled = false;
	}

	private reloadRows() {
		if (!this.table) {
			this.rows = [];
			return;
		}
		if (this.excludeLastRow) {
			this.rows = this.table.rows.slice(0, -1);
		} else {
			this.rows = this.table.rows.slice();
		}
	}

	onNewRowCreationBegin() {
		this.excludeLastRow = true;
		this.reloadRows();
	}

	onRowComplete(_row: TableRow) {
		this.excludeLastRow = false;
		this.reloadRows();
		this.rowDragEnabled = true;
	}
}
