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

import {v4 as uuid} from "uuid";
import {find} from "lodash-es";
import {Subject} from "rxjs";

import {Injectable} from '@angular/core';

import {Graph, GraphElements} from "@app/models/graph";
import {GraphNode} from "@app/models/graph-node";
import {GraphEdge} from "@app/models/graph-edge";
import {answersEqual, AnswerValue, cloneAnswer} from "@app/models/answer-value";
import {ElementId} from "@app/models/element-id";

import {GraphService} from "@app/services/graph.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.14
 */
@Injectable({
	providedIn: 'root'
})
export class GraphElementService {

	private static unnamedEdgePlaceholderNumber: number = 1;

	private readonly _elementCountChanged = new Subject<Graph>();

	readonly elementCountChanged = this._elementCountChanged.asObservable();

	constructor(private readonly graphService: GraphService) {
	}

	async addNode(value: string, graph: Graph): Promise<GraphNode> {
		const answer: AnswerValue = {alternatives: [], default: value};
		const node: GraphNode = {
			id: uuid(),
			value: answer,
		};
		graph.nodes.push(node);
		const updatedGraph = await this.graphService.update(graph);
		this._elementCountChanged.next(updatedGraph);
		return node;
	}

	async removeNode(node: GraphNode, graph: Graph) {
		graph.nodes = graph.nodes.filter(x => x.id !== node.id);
		const updatedGraph = await this.graphService.update(graph);
		this._elementCountChanged.next(updatedGraph);
	}

	async removeNodeFromGraph(node: GraphNode, graphId: ElementId) {
		const graph = await this.graphService.getById(graphId);
		await this.removeNode(node, graph);
	}

	async removeEdge(edge: GraphEdge, graph: Graph) {
		graph.edges = graph.edges.filter(x => x.id !== edge.id);
		const updatedGraph = await this.graphService.update(graph);
		this._elementCountChanged.next(updatedGraph);
		return updatedGraph;
	}

	async removeEdgeFromGraph(edge: GraphEdge, graphId: ElementId) {
		const graph = await this.graphService.getById(graphId);
		await this.removeEdge(edge, graph);
	}

	async addEdge(graph: Graph, from: GraphNode, to: GraphNode, label: string = ''): Promise<GraphEdge> {
		const edge: GraphEdge = {
			id: uuid(),
			value: {default: label, alternatives: []},
			sourceId: from.id,
			targetId: to.id
		};
		graph.edges.push(edge);
		await this.graphService.update(graph);

		GraphElementService.nameAllEdgesIfAnyAreLabeled(from, graph);
		const updatedGraph = await this.graphService.update(graph);
		this._elementCountChanged.next(updatedGraph);

		return edge;
	}

	async addNodeToGraph(graphId: ElementId, value: string) : Promise<GraphNode> {
		const graph = await this.graphService.getById(graphId);
		return await this.addNode(value, graph);
	}

	async addEdgeToGraph(graphId: ElementId, from: GraphNode, to: GraphNode, label: string = ''): Promise<GraphEdge> {
		const graph = await this.graphService.getById(graphId);
		return await this.addEdge(graph, from, to, label);
	}

	getNode(id: string, graph: GraphElements): GraphNode {
		const node = this.findNode(id, graph);
		if (!node) {
			throw new Error("Node not found");
		}
		return node;
	}

	getEdge(id: string, graph: GraphElements): GraphEdge {
		const edge = this.findEdge(id, graph);
		if (!edge) {
			throw Error("Edge not found");
		}
		return edge;
	}

	async updateEdge(newLabel: string,
					 edgeId: string,
					 graphId: ElementId) {
		const graph = await this.graphService.getById(graphId);
		const edge = this.getEdge(edgeId, graph);
		edge.value.default = newLabel;

		for (const node of graph.nodes) {
			await GraphElementService.nameAllEdgesIfAnyAreLabeled(node, graph);
		}
		await this.graphService.update(graph);
	}

	async updateNode(label: string,
					 nodeId: string,
					 graphId: ElementId) {
		const graph = await this.graphService.getById(graphId);
		const node = this.getNode(nodeId, graph);
		node.value.default = label;

		await this.graphService.update(graph);
	}

	static cloneGraphElements(graph: GraphElements): GraphElements {
		return {
			edges: graph.edges.map(edge => this.cloneEdge(edge)),
			nodes: graph.nodes.map(node => this.cloneNode(node)),
		};
	}

	getDiff(oldGraph: GraphElements, newGraph: GraphElements): GraphDifference {
		const removed: GraphElements = {
			nodes: oldGraph.nodes.filter(x => !this.findNode(x.id, newGraph)),
			edges: oldGraph.edges.filter(x => !this.findEdge(x.id, newGraph)),
		};
		const added: GraphElements = {
			nodes: newGraph.nodes.filter(x => !this.findNode(x.id, oldGraph)),
			edges: newGraph.edges.filter(x => !this.findEdge(x.id, oldGraph))
		};
		const edited: GraphElements = {
			nodes: newGraph.nodes.filter(node => this.editedNodeExists(node, oldGraph)),
			edges: newGraph.edges.filter(edge => this.editedEdgeExists(edge, oldGraph)),
		}
		return {
			added: added,
			edited: edited,
			removed: removed
		};
	}

	static getOutgoingEdges(node: GraphNode, graph: GraphElements): GraphEdge[] {
		return graph.edges.filter(edge => edge.sourceId === node.id);
	}

	private findNode(id: string, graph: GraphElements): GraphNode | null {
		return find(graph.nodes, (node) => node.id === id) || null;
	}

	private findEdge(id: string, graph: GraphElements): GraphEdge | null {
		return find(graph.edges, (edge) => edge.id === id) || null;
	}

	private static cloneNode(node: GraphNode) : GraphNode {
		return {
			id: node.id,
			value: cloneAnswer(node.value)
		};
	}

	private static cloneEdge(edge: GraphEdge) : GraphEdge {
		return {
			id: edge.id,
			value: cloneAnswer(edge.value),
			sourceId: edge.sourceId,
			targetId: edge.targetId,
		}
	}

	private editedNodeExists(node: GraphNode, graph: GraphElements): boolean {
		const found = this.findNode(node.id, graph);
		if (!found) {
			return false;
		}
		return !GraphElementService.nodesEqual(node, found);
	}

	private editedEdgeExists(edge: GraphEdge, graph: GraphElements): boolean {
		const found = this.findEdge(edge.id, graph);
		if (!found) {
			return false;
		}
		return !GraphElementService.edgesEqual(edge, found);
	}

	private static nodesEqual(node: GraphNode, other: GraphNode): boolean {
		return node.id === other.id
			&& answersEqual(node.value, other.value);
	}

	private static edgesEqual(edge: GraphEdge, other: GraphEdge): boolean {
		return edge.id === other.id
			&& answersEqual(edge.value, other.value)
			&& edge.sourceId === other.sourceId
			&& edge.targetId === other.targetId;
	}

	private static nameAllEdgesIfAnyAreLabeled(node: GraphNode, graph: Graph) {
		if (GraphElementService.anyOutgoingEdgesHaveLabels(node, graph)) {
			GraphElementService.renameAllUnnamedEdges(node, graph);
		}
	}

	private static renameAllUnnamedEdges(node: GraphNode, graph: Graph) {
		if (GraphElementService.allOutgoingEdgesHaveLabels(node, graph)) {
			return;
		}
		const edges = GraphElementService.getOutgoingEdges(node, graph)
			.filter(edge => edge.value.default.length === 0);
		if (edges.length === 0) {
			return;
		}
		for (const edge of edges) {
			edge.value.default = 'Unnamed edge ' + GraphElementService.unnamedEdgePlaceholderNumber++;
		}
	}

	private static allOutgoingEdgesHaveLabels(node: GraphNode, graph: Graph): boolean {
		return this.getOutgoingEdges(node, graph).every(edge => edge.value.default !== '');
	}

	private static anyOutgoingEdgesHaveLabels(node: GraphNode, graph: Graph): boolean {
		const edges = this.getOutgoingEdges(node, graph);
		return find(edges, edge => edge.value.default !== '') !== undefined;
	}
}

export type GraphDifference = {
	added: GraphElements,
	edited: GraphElements,
	removed: GraphElements,
}
