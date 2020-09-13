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
import {SidebarDeckElement, SidebarDeckElementComponent} from "./sidebar-deck-element.component";
import {Graph} from "../../models/Graph";
import {NavigationService} from "../../services/navigation.service";
import {GraphService} from "../../services/graph.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.12
 */
@Component({
	selector: 'li [deck-element-graph]',
	templateUrl: './sidebar-deck-element.component.html',
	styleUrls: ['./sidebar-deck-element.component.sass']
})
export class SidebarGraphListElementComponent
	extends SidebarDeckElementComponent
	implements OnInit {

	constructor(
		private readonly graphService: GraphService,
		private readonly navigationService: NavigationService) {
		super();
	}

	async ngOnInit() {
		await super.ngOnInit();

		this.elementCount = 42;
	}

	protected async onClickHandler(id: string): Promise<void> {
		await this.navigationService.openGraph(id);
	}

	protected async onDeleteHandler(id: string): Promise<void> {
		await this.graphService.delete(id);
	}

	protected async onUpdateHandler(element: SidebarDeckElement): Promise<void> {
		await this.graphService.update(element as Graph);
	}
}
