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
import {NavigationService} from "../../services/navigation.service";
import {SidebarDeckElement, SidebarDeckElementComponent} from "./sidebar-deck-element.component";
import {SimpleCardService} from "../../services/simple-card.service";
import {SimpleCardList} from "../../models/SimpleCardList";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.11.21
 */
@Component({
	selector: 'li [deck-element-simple-card-list]',
	templateUrl: './sidebar-deck-element.component.html',
	styleUrls: ['./sidebar-deck-element.component.sass']
})
export class SidebarSimpleCardListListElementComponent
	extends SidebarDeckElementComponent
	implements OnInit {

	constructor(
		private readonly cardService: SimpleCardService,
		private readonly navigationService: NavigationService) {
		super();

		this.cardService.rowCountChanged.subscribe(async (list: SimpleCardList) => {
			if (this.element?.id === list.id) {
				await this.updateElementCount();
			}
		});
	}

	async ngOnInit(): Promise<void> {
		await super.ngOnInit();

		if (this.element) {
			await this.updateElementCount();
		}
	}

	private async updateElementCount() {
		//TODO
	}

	protected async onClickHandler(id: string) {
		await this.navigationService.openSimpleCardList(id);
	}

	protected async onDeleteHandler(id: string) {
		//TODO
	}

	protected async onUpdateHandler(element: SidebarDeckElement) {
		//TODO
	}
}
