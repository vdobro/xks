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

import {DataSet, Network, Options} from "vis-network/standalone";
import {AfterContentChecked, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Graph} from "@app/models/Graph";
import {GraphService} from "@app/services/graph.service";
import {NavigationService} from "@app/services/navigation.service";
import {TopBarService} from "@app/services/top-bar.service";
import {SidebarService} from "@app/services/sidebar.service";
import {GraphElementService} from "@app/services/graph-element.service";
import {GraphNode} from "@app/models/GraphNode";
import {GraphEdge} from "@app/models/GraphEdge";
import {GraphToolbarComponent} from "@app/components/graph-toolbar/graph-toolbar.component";
import {NavigationControlService} from "@app/services/navigation-control.service";
import {DECK_ID_PARAM} from "@app/components/deck-view/deck-view.component";

export const GRAPH_ID_PARAM: string = 'graphId';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.14
 */
@Component({
	selector: 'app-graph-view',
	templateUrl: './graph-view.component.html',
	styleUrls: ['./graph-view.component.sass']
})
export class GraphViewComponent implements OnInit, AfterContentChecked {

	@ViewChild(GraphToolbarComponent)
	toolbar: GraphToolbarComponent | undefined;

	@ViewChild('networkContainer', {static: true})
	networkContainer: ElementRef | undefined;

	@ViewChild('graphToolbar', {static: true})
	graphToolbar: ElementRef | undefined;

	@ViewChild('graphViewContainer', {static: true})
	container: ElementRef | undefined;

	graph: Graph | null = null;
	network: Network | null = null;

	renderingOptions: Options = {
		nodes: {
			shape: "box"
		},
		interaction: {
			selectConnectedEdges: false
		},
		physics: {
			repulsion: {
				nodeDistance: 300,
				springConstant: 0.01,
				centralGravity: 0.01,
			}
		}
	};

	selectedEdge: GraphEdge | null = null;
	selectedNode: GraphNode | null = null;
	selectedSourceNode: GraphNode | null = null;

	editMode: boolean = false;

	private rootContainerWidth: number = 0;

	private readonly nodes = new DataSet<any>();
	private readonly edges = new DataSet<any>();

	constructor(
		private readonly graphService: GraphService,
		private readonly graphElementService: GraphElementService,
		private readonly navigationService: NavigationService,
		private readonly navControlService: NavigationControlService,
		private readonly topBarService: TopBarService,
		private readonly sidebarService: SidebarService,
		private readonly activatedRoute: ActivatedRoute) {
		this.navControlService.rootContainerWidth.subscribe((value: number) => {
			this.rootContainerWidth = value;
		})
	}

	async ngOnInit() {
		this.topBarService.clearItems();
		this.topBarService.setBackButtonLabel('Back to deck');

		await this.setUpNetworkView();
		this.setUpDataLoading();
		this.setUpDataEvents();
		this.adjustGraphViewSize();
	}

	ngAfterContentChecked() {
		this.adjustGraphViewSize();
	}

	@HostListener("document:keydown.escape")
	onEscapeClick(_: KeyboardEvent) {
		this.selectedNode = null;
		this.selectedSourceNode = null;
	}

	@HostListener("document:keydown.delete")
	async onDeleteClick(_: KeyboardEvent) {
		if (this.editMode || !this.graph) {
			return;
		}
		if (this.selectedNode) {
			await this.graphElementService.removeNode(this.selectedNode, this.graph);
		} else if (this.selectedEdge) {
			await this.graphElementService.removeEdge(this.selectedEdge, this.graph);
		}
	}

	private adjustGraphViewSize() {
		if (!this.container) {
			return;
		}
		const containerSize = this.container.nativeElement.getBoundingClientRect();
		const containerWidth = containerSize.width;
		const containerHeight = containerSize.height;
		const rootContainerWidth = this.rootContainerWidth - 40;
		this.adjustCanvasSize(containerHeight, containerWidth < 900
			? containerWidth : rootContainerWidth);
	}

	private adjustCanvasSize(containerHeight: number, containerWidth: number) {
		if (!this.graphToolbar) {
			return;
		}
		const toolbarHeight = this.graphToolbar.nativeElement.offsetHeight + 21;
		const height = Math.max(containerHeight - toolbarHeight, 400);
		this.network?.setSize(`${containerWidth}px`, `${height}px`);
		this.network?.redraw();
	}

	private setUpDataLoading() {
		this.activatedRoute.paramMap.subscribe(async (params: ParamMap) => {
			const id = params.get(GRAPH_ID_PARAM);
			const deckId = params.get(DECK_ID_PARAM);
			this.graph = (id && deckId) ? await this.graphService.getById({
				element: id,
				deck: deckId
			}) : null;

			if (this.graph) {
				await this.sidebarService.selectGraph(this.graph);
				await this.setUpNetworkView();
			} else {
				await this.navigationService.goToDeckList();
			}
		});
	}

	private setUpDataEvents() {
		// TODO node and edge changes
		/*this.nodeRepository.entityCreated.subscribe(async (entity: GraphNode) => {
			this.nodes.add(await GraphViewComponent.mapToNodeView(entity));
			this.network?.fit();
		});
		this.nodeRepository.entityUpdated.subscribe(async (entity: GraphNode) => {
			this.nodes.update(await GraphViewComponent.mapToNodeView(entity));
			this.selectedSourceNode = null;
		})
		this.nodeRepository.entityDeleted.subscribe((id: string) => {
			this.nodes.remove(id);
			this.network?.fit();
			this.selectedSourceNode = null;
			this.selectedNode = null;
		});
		this.edgeRepository.entityCreated.subscribe((entity: GraphEdge) => {
			this.edges.add(GraphViewComponent.mapToEdgeView(entity));
			this.network?.fit();
		});
		this.edgeRepository.entityUpdated.subscribe((entity: GraphEdge) => {
			this.edges.update(GraphViewComponent.mapToEdgeView(entity));
		});
		this.edgeRepository.entityDeleted.subscribe((id: string) => {
			this.edges.remove(id);
			this.selectedEdge = null;
		});
		this.valueRepository.entityUpdated.subscribe((answerValue: AnswerValue) => {
			this.nodes.forEach(async (view: NodeView, _) => {
				const node = await this.nodeRepository.getById(view.id);
				if (answerValue.id === node.valueId) {
					const newView = await GraphViewComponent.mapToNodeView(node);
					this.nodes.update(newView);
				}
			});
		});*/
	}

	private async setUpNetworkView() {
		this.loadGraphElements();

		if (!this.networkContainer) {
			return;
		}
		this.network = new Network(this.networkContainer.nativeElement,
			{nodes: this.nodes, edges: this.edges}, this.renderingOptions);
		this.network.on('deselectNode', async (args: NetworkDeselection) => {
			await this.onDeselectNode(args);
		});
		this.network.on('selectNode', async (args: NetworkSelection) => {
			await this.onSelectNode(args.nodes[0]);
		});
		this.network.on('doubleClick', async (args: NetworkSelection) => {
			if (args.nodes.length > 0) {
				await this.onDoubleClickNode(args.nodes[0]);
			} else if (args.edges.length > 0) {
				await this.onDoubleClickEdge(args.edges[0]);
			}
		});
		this.network.on('selectEdge', async (args: NetworkSelection) => {
			if (args.edges.length === 1) {
				await this.onSelectEdge(args.edges[0]);
			}
		});
		this.network.on('deselectEdge', async _ => {
			await this.onDeselectEdge();
		});
	}

	private loadGraphElements() {
		this.edges.clear();
		this.nodes.clear();

		if (!this.graph) {
			return;
		}

		const nodes = this.graph.nodes;
		for (let node of nodes) {
			this.nodes.add(GraphViewComponent.mapToNodeView(node));
			const edges = node.edges.map(edge => {
				return GraphViewComponent.mapToEdgeView(edge, node);
			});
			this.edges.add(edges);
		}
	}

	private onSelectEdge(id: string) {
		if (!this.graph) {
			return;
		}
		this.selectedEdge = this.graphElementService.findEdge(id, this.graph);
	}

	private async onDeselectEdge() {
		this.selectedEdge = null;
		this.toolbar?.closeEditor();
	}

	private async onSelectNode(id: string) {
		this.selectedEdge = null;
		if (!id) {
			this.selectedNode = null;
		}
		if (!this.graph) {
			return;
		}
		if (this.selectedNode?.id !== id) {
			this.selectedNode = this.graphElementService.findNode(id, this.graph);
		}
		if (this.selectedSourceNode) {
			const source = this.selectedSourceNode;
			this.selectedSourceNode = null;
			await this.graphElementService.addEdge(this.graph, source, this.selectedNode);
		}
	}

	private onDoubleClickNode(id: string) {
		if (!this.graph) {
			return;
		}
		if (!id) {
			this.selectedSourceNode = null;
		}
		this.toolbar?.openEditor();
		if (this.selectedSourceNode?.id !== id) {
			this.selectedSourceNode = this.graphElementService.findNode(id, this.graph);
		}
	}

	private async onDoubleClickEdge(id: string) {
		await this.onSelectEdge(id);
		this.toolbar?.openEditor();
	}

	private async onDeselectNode(args: NetworkDeselection) {
		this.editMode = false;
		const nextNode = args.nodes[0];
		if (!nextNode) {
			this.selectedNode = null;
			this.selectedSourceNode = null;
			this.toolbar?.closeEditor();
		} else {
			await this.onSelectNode(nextNode);
		}
	}

	private static mapToNodeView(node: GraphNode): NodeView {
		const label = node.value;
		return {
			id: node.id,
			label: label.default,
			margin: 10,
			color: {
				border: "#303030",
				background: "#ffffff",
				highlight: {
					border: "#1e87f0",
					background: "#fafafa",
				}
			},
			font: {
				color: "#000000",
				face: "IBM Plex Sans",
				size: 13,
			},
			shadow: {
				enabled: true,
				size: 1,
			},
		};
	}

	private static mapToEdgeView(edge: GraphEdge, from: GraphNode): EdgeView {
		return {
			id: edge.id,
			from: from.id,
			to: edge.targetId,
			label: edge.name,
			arrows: "to",
			color: "#000000",
			arrowStrikethrough: false,
		};
	}
}

export interface EdgeView {
	id: string,
	from: string,
	to: string,
	label: string,
	arrows: string,
	color: string,
	arrowStrikethrough: boolean,
}

export interface NodeView {
	id: string,
	label: string,
	margin: number,
	color: {
		border: string,
		background: string,
		highlight: {
			border: string,
			background: string,
		},
	},
	font: {
		size: number,
		face: string,
		color: string,
	},
	shadow: {
		enabled: boolean,
		size: number
	},
}

interface NetworkDeselection extends NetworkSelection {
	previousSelection: NetworkSelection
}

interface NetworkSelection {
	nodes: string[],
	edges: string[],
}
