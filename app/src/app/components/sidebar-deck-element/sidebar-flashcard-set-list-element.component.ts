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

import {NavigationService} from "@app/services/navigation.service";

import {SidebarDeckElement, SidebarDeckElementComponent} from "./sidebar-deck-element.component";
import {FlashcardList} from "@app/models/flashcard-list";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.11.21
 */
@Component({
	selector: 'li [deck-element-flashcard-set]',
	templateUrl: './sidebar-deck-element.component.html',
	styleUrls: ['./sidebar-deck-element.component.sass']
})
export class SidebarFlashcardSetListElementComponent
	extends SidebarDeckElementComponent
	implements OnInit {

	constructor(
		private readonly navigationService: NavigationService) {
		super();
		this.elementType = 'flashcard collection';

		//TODO:
		/*this.cardService.cardCountChanged.subscribe(async (list: FlashcardList) => {
			if (this.element?.id === list.id) {
				await this.updateElementCount();
			}
		});*/
	}

	async ngOnInit(): Promise<void> {
		await super.ngOnInit();

		if (this.element) {
			await this.updateElementCount();
		}
	}

	private async updateElementCount() {
		//const cards = await this.cardService.getBySet(this.element as FlashcardList);
		//this.elementCount = cards.length;
	}

	protected async onClickHandler(id: string) {
		//await this.navigationService.openFlashcardSet(id);
	}

	protected async onDeleteHandler(id: string) {
		//await this.cardSetService.delete(id);
	}

	protected async onUpdateHandler(element: SidebarDeckElement) {
		//await this.cardSetService.update(element as FlashcardList);
	}
}
