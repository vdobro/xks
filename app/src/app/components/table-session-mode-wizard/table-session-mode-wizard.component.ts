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

import UIkit from 'uikit';

import {
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
import {Table} from "../../models/Table";
import {TableColumn} from "../../models/TableColumn";
import {TableSessionModeService} from "../../services/table-session-mode.service";
import {TableCellService} from "../../services/table-cell.service";
import {Subject} from "rxjs";
import {TableSessionMode} from "../../models/TableSessionMode";

@Component({
	selector: 'app-table-session-mode-wizard',
	templateUrl: './table-session-mode-wizard.component.html',
	styleUrls: ['./table-session-mode-wizard.component.sass']
})
export class TableSessionModeWizardComponent implements OnInit, OnChanges {

	@ViewChild("tableSessionQuestionColumns", {static: true})
	questionColumnsSortable: ElementRef;

	@ViewChild("tableSessionAnswerColumns", {static: true})
	answerColumnsSortable: ElementRef;

	@Input()
	table: Table;

	@Output()
	configurationChanged = new EventEmitter<void>();
	@Output()
	sessionModeCreated = new Subject<TableSessionMode>();

	configurationValid : boolean = false;

	tableColumns: TableColumn[];
	questionColumns: TableColumn[] = [];
	answerColumns: TableColumn[] = [];

	constructor(
		private readonly sessionModeService: TableSessionModeService,
		private readonly tableCellService: TableCellService) {
		this.tableCellService.columnsChanged.subscribe(async table => {
			if (this.table?.id === table.id) {
				await this.reloadColumns();
			}
		});
	}

	async ngOnInit() {
		UIkit.sortable(this.questionColumnsSortable.nativeElement);
		UIkit.sortable(this.answerColumnsSortable.nativeElement);

		this.setupSortable(this.questionColumnsSortable, this.questionColumns);
		this.setupSortable(this.answerColumnsSortable, this.answerColumns);

		await this.reportValidity();
	}

	async ngOnChanges(changes: SimpleChanges) {
		if (this.table) {
			await this.reloadColumns();
		}
		await this.reportValidity();
	}

	async createSessionMode(): Promise<TableSessionMode> {
		return await this.sessionModeService.create(this.table,
			this.questionColumns, this.answerColumns);
	}

	private async reportValidity() {
		this.configurationValid = this.questionColumns.length > 0 && this.answerColumns.length > 0;
		this.configurationChanged.emit();
	}

	private async reloadColumns() {
		this.tableColumns = await this.tableCellService.getColumns(this.table);
		this.questionColumns.splice(0, this.questionColumns.length);
		this.answerColumns.splice(0, this.answerColumns.length);
	}

	private setupSortable(elementRef: ElementRef, targetCollection: TableColumn[]) {
		UIkit.util.on(elementRef.nativeElement, 'added', async args => {
			const itemId = TableSessionModeWizardComponent.getItemIdFromSortableEvent(args);
			await this.addColumn(itemId, targetCollection);
			await this.reportValidity();
		});
		UIkit.util.on(elementRef.nativeElement, 'removed', async args => {
			const itemId = TableSessionModeWizardComponent.getItemIdFromSortableEvent(args);
			this.removeColumn(itemId, targetCollection);
			await this.reportValidity();
		});
	}

	private async addColumn(itemId: string, target: TableColumn[]) {
		if (target.find(col => col.id === itemId)) {
			return;
		}
		const column = this.tableColumns.find(col => col.id === itemId);
		if (column) {
			target.push(column);
		} else {
			UIkit.notification({
				message: 'Table column not found, refresh your page',
				status: 'warning'
			});
		}
	}

	private removeColumn(itemId: string, target: TableColumn[]) {
		const element = target.find(col => col.id == itemId);
		if (element) {
			const index = target.indexOf(element);
			target.splice(index, 1);
		}
	}

	private static getItemIdFromSortableEvent(args): string {
		return args.detail[1].id;
	}
}
