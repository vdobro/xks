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

import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {Deck} from "@app/models/Deck";

import {SidebarService} from "@app/services/sidebar.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.14
 */
@Component({
	selector: 'app-deck-list-view',
	templateUrl: './deck-list-view.component.html',
	styleUrls: ['./deck-list-view.component.sass']
})
export class DeckListViewComponent implements OnInit {

	@ViewChild("deckListFooter")
	deckListFooter: ElementRef | undefined;

	@Input()
	decks: Deck[] = [];

	constructor(private readonly sidebarService: SidebarService) {
	}

	ngOnInit(): void {
		this.sidebarService.depopulate();
	}

	onNewDeckCreated() {
		if (!this.deckListFooter) {
			return;
		}

		// @ts-ignore It can actually scroll to an index
		if (this.decks.length > 0) {
			UIkit.scroll(this.deckListFooter.nativeElement);
		}
	}
}
