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

import {DataSet, Network} from "vis-network/standalone";
import ResizeObserver from 'resize-observer-polyfill';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class GraphViewComponent implements OnInit, OnDestroy {

	@ViewChild('networkContainer', {static: true})
	networkContainer: ElementRef;

	graph: Graph;
	network: Network;

	private sizeObserver: ResizeObserver = null;

	constructor(
		private readonly graphService: GraphService,
		private readonly navigationService: NavigationService,
		private readonly topBarService: TopBarService,
		private readonly sidebarService: SidebarService,
		private readonly activatedRoute: ActivatedRoute) {
	}

	ngOnInit(): void {
		this.topBarService.clearItems();

		this.setUpSizeHandler();
		this.loadData();
	}

	ngOnDestroy() {
		this.sizeObserver?.unobserve(this.networkContainer.nativeElement);
		this.sizeObserver?.disconnect();
		this.sizeObserver = null;
	}

	private setUpSizeHandler() {
		this.sizeObserver = new ResizeObserver(entries => {
			const entry = entries[0].contentRect;
			const height = Math.max(entry.height - 50, 400);
			const width = entry.width;
			this.network?.setSize(`${width}px`, `${height}px`);
		});
		this.sizeObserver.observe(this.networkContainer.nativeElement);
	}

	private loadData() {
		this.activatedRoute.paramMap.subscribe(async params => {
			this.graph = await this.graphService.getById(params.get(GRAPH_ID_PARAM));
			if (this.graph) {
				await this.sidebarService.selectGraph(this.graph);
				await this.renderData();
			} else {
				await this.navigationService.goToDeckList();
			}
		});
	}

	private async renderData() {
		const nodes = new DataSet([
			{id: 1, label: "Node 1"},
			{id: 2, label: "Node 2"},
			{id: 3, label: "Node 3"},
			{id: 4, label: "Node 4"},
			{id: 5, label: "Node 5"}
		]);

		// create an array with edges
		const edges = new DataSet<any>([
			{from: 1, to: 3},
			{from: 1, to: 2},
			{from: 2, to: 4},
			{from: 2, to: 5},
			{from: 3, to: 3}
		]);

		// create a network
		const container = this.networkContainer.nativeElement;
		const data = {
			nodes: nodes,
			edges: edges
		};
		const options = {};
		this.network = new Network(container, data, options);
	}
}
