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

import {GraphElements} from "@app/models/graph";
import {GraphEdge} from "@app/models/graph-edge";
import {GraphNode} from "@app/models/graph-node";
import {ElementId} from "@app/models/element-id";

import {GraphService} from "@app/services/graph.service";
import {NavigationService} from "@app/services/navigation.service";
import {TopBarService} from "@app/services/top-bar.service";
import {SidebarService} from "@app/services/sidebar.service";
import {GraphElementService} from "@app/services/graph-element.service";
import {NavigationControlService} from "@app/services/navigation-control.service";

import {GraphToolbarComponent} from "@app/components/graph-toolbar/graph-toolbar.component";
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

	graphId: ElementId | null = null;
	graphName: string | null = null;
	graphElements: GraphElements | null = null;

	selectedEdge: GraphEdge | null = null;
	selectedNode: GraphNode | null = null;
	selectedSourceNode: GraphNode | null = null;

	editMode: boolean = false;

	private rootContainerWidth: number = 0;

	network: Network | null = null;
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
		this.navControlService.rootContainerWidth.subscribe({
			next: (value: number) => {
				this.rootContainerWidth = value;
			}
		});
	}

	async ngOnInit(): Promise<void> {
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
		if (this.editMode || !this.graphId) {
			return;
		}
		if (this.selectedNode) {
			await this.graphElementService.removeNodeFromGraph(this.selectedNode, this.graphId);
		} else if (this.selectedEdge) {
			await this.graphElementService.removeEdgeFromGraph(this.selectedEdge, this.graphId);
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

			const graph = (id && deckId) ? await this.graphService.getById({
				element: id,
				deck: deckId
			}) : null;
			this.graphId = (id && deckId) ? {element: id, deck: deckId} : null;
			this.graphElements = (graph) ? GraphElementService.cloneGraphElements(graph) : null;
			this.graphName = graph?.name || null;

			if (graph) {
				await this.sidebarService.selectDeckElement(graph);
				await this.setUpNetworkView();
			} else {
				await this.navigationService.goToDeckList();
			}
		});
	}

	private setUpDataEvents() {
		this.graphService.graphChanged.subscribe(updatedGraph => {
			if (this.graphId?.element !== updatedGraph.id) {
				return;
			}
			this.graphName = updatedGraph?.name || null;

			const oldGraph = this.graphElements!;
			const diff = this.graphElementService.getDiff(oldGraph, updatedGraph);
			for (const addedNode of diff.added.nodes) {
				this.addNode(addedNode, true);
			}
			for (const editedNode of diff.edited.nodes) {
				this.updateNode(editedNode);
			}
			for (const removedNode of diff.removed.nodes) {
				this.removeNode(removedNode);
			}
			for (const addedEdge of diff.added.edges) {
				this.addEdge(addedEdge, true);
			}
			for (const editedEdge of diff.edited.edges) {
				this.updateEdge(editedEdge);
			}
			for (const removedEdge of diff.removed.edges) {
				this.removeEdge(removedEdge);
			}
			this.graphElements = GraphElementService.cloneGraphElements(updatedGraph);
		});
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

		if (!this.graphElements) {
			return;
		}

		const nodes = this.graphElements.nodes;
		const edges = this.graphElements.edges;

		for (const node of nodes) {
			this.addNode(node, false);
		}
		for (const edge of edges) {
			this.addEdge(edge, false);
		}
		this.network?.fit();
	}

	private onSelectEdge(id: string) {
		if (!this.graphElements) {
			return;
		}
		this.selectedEdge = this.graphElementService.getEdge(id, this.graphElements);
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
		if (!this.graphElements || !this.graphId) {
			return;
		}
		if (this.selectedNode?.id !== id) {
			this.selectedNode = this.graphElementService.getNode(id, this.graphElements);
		}
		if (this.selectedSourceNode) {
			const source = this.selectedSourceNode;
			this.selectedSourceNode = null;
			await this.graphElementService.addEdgeToGraph(this.graphId!, source, this.selectedNode);
		}
	}

	private onDoubleClickNode(id: string) {
		if (!this.graphElements) {
			return;
		}
		if (!id) {
			this.selectedSourceNode = null;
		}
		this.toolbar?.openEditor();
		if (this.selectedSourceNode?.id !== id) {
			this.selectedSourceNode = this.graphElementService.getNode(id, this.graphElements);
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

	private addNode(node: GraphNode, fitNetwork: boolean) {
		this.nodes.add(GraphViewComponent.mapToNodeView(node));
		if (fitNetwork) {
			this.network?.fit();
		}
	}

	private addEdge(edge: GraphEdge, fitNetwork: boolean) {
		this.edges.add(GraphViewComponent.mapToEdgeView(edge));
		if (fitNetwork) {
			this.network?.fit();
		}
	}

	private updateNode(node: GraphNode) {
		this.nodes.update(GraphViewComponent.mapToNodeView(node));
		this.selectedSourceNode = null;
	}

	private updateEdge(edge: GraphEdge) {
		this.edges.update(GraphViewComponent.mapToEdgeView(edge));
	}

	private removeNode(node: GraphNode) {
		this.nodes.remove(node.id);
		this.selectedSourceNode = null;
		this.selectedNode = null;
		this.network?.fit();
	}

	private removeEdge(edge: GraphEdge) {
		this.edges.remove(edge.id);
		this.selectedEdge = null;
		this.network?.fit();
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

	private static mapToEdgeView(edge: GraphEdge): EdgeView {
		return {
			id: edge.id,
			from: edge.sourceId,
			to: edge.targetId,
			label: edge.value.default,
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
