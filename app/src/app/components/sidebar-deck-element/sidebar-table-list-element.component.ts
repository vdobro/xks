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

import {Component, OnInit} from '@angular/core';
import {TableService} from "../../services/table.service";
import {Table} from "../../models/Table";
import {NavigationService} from "../../services/navigation.service";
import {TableCellService} from "../../services/table-cell.service";
import {SidebarDeckElement, SidebarDeckElementComponent} from "./sidebar-deck-element.component";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.06.11
 */
@Component({
	selector: 'li [deck-element-table]',
	templateUrl: './sidebar-deck-element.component.html',
	styleUrls: ['./sidebar-deck-element.component.sass']
})
export class SidebarTableListElementComponent
	extends SidebarDeckElementComponent
	implements OnInit {

	constructor(
		private readonly tableCellService: TableCellService,
		private readonly tableService: TableService,
		private readonly navigationService: NavigationService) {
		super();
		this.elementType = 'table';

		this.tableCellService.rowCountChanged.subscribe(async table => {
			if (this.element?.id === table.id) {
				await this.updateRowCount();
			}
		});
	}

	async ngOnInit(): Promise<void> {
		await super.ngOnInit();

		if (this.element) {
			await this.updateRowCount();
		}
	}

	private async updateRowCount() {
		const rows = await this.tableCellService.getRows(this.element as Table);
		this.elementCount = rows.length;
	}

	protected async onClickHandler(id: string) {
		await this.navigationService.openTable(id);
	}

	protected async onDeleteHandler(id: string) {
		await this.tableService.delete(id);
	}

	protected async onUpdateHandler(element: SidebarDeckElement) {
		await this.tableService.update(element as Table);
	}
}
