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

import {Component, OnInit, ViewChild} from '@angular/core';
import {NewDeckElementModalComponent} from "../new-deck-element-modal/new-deck-element-modal.component";
import {SidebarService} from "../../services/sidebar.service";
import {Deck} from "../../models/Deck";
import {GraphService} from "../../services/graph.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.13
 */
@Component({
	selector: 'li [navbar-new-graph]',
	templateUrl: './navbar-new-graph.component.html',
	styleUrls: ['./navbar-new-graph.component.sass']
})
export class NavbarNewGraphComponent implements OnInit {

	@ViewChild(NewDeckElementModalComponent)
	childModal: NewDeckElementModalComponent;

	deck: Deck;

	constructor(private readonly sidebarService: SidebarService,
				private readonly graphService: GraphService) {
		this.sidebarService.activeDeck.subscribe(value => this.deck = value);
		this.deck = this.sidebarService.currentDeck;
	}

	ngOnInit(): void {
	}

	async createGraph(name: string) {
		await this.graphService.create(this.deck, name);
	}
}
