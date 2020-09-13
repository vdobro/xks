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
import {ActivatedRoute} from "@angular/router";
import {Graph} from "../../models/Graph";
import {GraphService} from "../../services/graph.service";
import {NavigationService} from "../../services/navigation.service";
import {TopBarService} from "../../services/top-bar.service";
import {SidebarService} from "../../services/sidebar.service";

export const GRAPH_ID_PARAM: string = 'graphId';

@Component({
	selector: 'app-graph-view',
	templateUrl: './graph-view.component.html',
	styleUrls: ['./graph-view.component.sass']
})
export class GraphViewComponent implements OnInit {

	graph: Graph;

	constructor(
		private readonly graphService: GraphService,
		private readonly navigationService: NavigationService,
		private readonly topBarService: TopBarService,
		private readonly sidebarService: SidebarService,
		private readonly activatedRoute: ActivatedRoute) {
	}

	ngOnInit(): void {
		this.activatedRoute.paramMap.subscribe(async params => {
			this.graph = await this.graphService.getById(params.get(GRAPH_ID_PARAM));
			if (this.graph) {
				await this.sidebarService.selectGraph(this.graph);
				await this.reloadAll();
			} else {
				await this.navigationService.goToDeckList();
			}
		});
		this.topBarService.clearItems();
	}

	private async reloadAll() {

	}
}
