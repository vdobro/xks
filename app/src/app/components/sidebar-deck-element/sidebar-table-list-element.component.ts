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

import {Table} from "@app/models/Table";

import {TableService} from "@app/services/table.service";
import {NavigationService} from "@app/services/navigation.service";
import {TableElementService} from "@app/services/table-element.service";

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
		private readonly tableCellService: TableElementService,
		private readonly tableService: TableService,
		private readonly navigationService: NavigationService) {
		super();

		this.tableCellService.rowCountChanged.subscribe(async table => {
			if (this.element?.id === table.id) {
				await this.updateRowCount();
			}
		});
	}

	ngOnInit() {
		super.ngOnInit();

		if (this.element) {
			this.updateRowCount();
		}
	}

	private updateRowCount() {
		if (!this.element) {
			return;
		}
		this.elementCount = (this.element as Table).rows.length;
	}

	protected async onClickHandler(id: string) {
		if (this.deck) {
			await this.navigationService.openTable({element: id, deck: this.deck.id});
		}
	}

	protected async onDeleteHandler(id: string) {
		if (this.deck) {
			await this.tableService.delete({element: id, deck: this.deck.id});
		}
	}

	protected async onUpdateHandler(element: SidebarDeckElement) {
		await this.tableService.update(element as Table);
	}
}
