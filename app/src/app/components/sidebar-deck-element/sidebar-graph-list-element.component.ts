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

import {Graph} from "@app/models/graph";

import {NavigationService} from "@app/services/navigation.service";
import {GraphService} from "@app/services/graph.service";
import {GraphElementService} from "@app/services/graph-element.service";

import {SidebarDeckElement, SidebarDeckElementComponent} from "@app/components/sidebar-deck-element/sidebar-deck-element.component";

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

	private graph: Graph | null = null;

	constructor(
		private readonly graphService: GraphService,
		private readonly graphElementService: GraphElementService,
		private readonly navigationService: NavigationService) {
		super();

		this.graphElementService.elementCountChanged.subscribe(async graph => {
			if (this.element?.id === graph.id) {
				await this.refreshGraph();
			}
		});
		this.elementType = 'graph';
	}

	async ngOnInit(): Promise<void> {
		super.ngOnInit();

		await this.refreshGraph();
	}

	protected async onClickHandler(id: string): Promise<void> {
		if (!this.deck) {
			return;
		}
		await this.navigationService.openGraph({element: id, deck: this.deck.id});
	}

	protected async onDeleteHandler(id: string): Promise<void> {
		if (!this.deck) {
			return;
		}
		await this.graphService.delete({element: id, deck: this.deck.id});
	}

	protected async onUpdateHandler(element: SidebarDeckElement): Promise<void> {
		await this.graphService.update(element as Graph);
	}

	private async refreshGraph() {
		if (!this.deck || !this.element) {
			return;
		}
		this.graph = await this.graphService.getById({element: this.element.id, deck: this.deck.id});
		this.elementCount = this.formatElementCount();
	}

	private formatElementCount(): string {
		if (!this.graph) {
			return '-';
		}

		const edges = this.graph.edges.length;
		const nodes = this.graph.nodes.length;
		if (edges > 0 && nodes > 0) {
			return `${nodes} + ${edges}`;
		}
		if (nodes) {
			return `${nodes}`;
		}
		return '0';
	}
}
