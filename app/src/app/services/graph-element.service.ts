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

import {v4 as uuid} from 'uuid';
import {find, flatten} from "lodash-es";

import {Injectable} from '@angular/core';
import {Graph} from "@app/models/Graph";
import {GraphNode} from "@app/models/GraphNode";
import {GraphEdge} from "@app/models/GraphEdge";
import {AnswerValue} from "@app/models/AnswerValue";

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

	constructor(private readonly graphService: GraphService) {

	}

	async anyNodesAndEdgesExist(graph: Graph): Promise<boolean> {
		const nodes = graph.nodes;
		if (nodes.length === 0) {
			return false;
		}
		const edges = this.getEdges(graph);
		return edges.length !== 0;
	}

	async addNode(value: string, graph: Graph): Promise<GraphNode> {
		const answer: AnswerValue = {alternatives: [], default: value};
		const node: GraphNode = {
			id: uuid(),
			value: answer,
			edges: [],
		};
		graph.nodes.push(node);
		await this.graphService.update(graph);
		return node;
	}

	async removeNode(node: GraphNode, graph: Graph) {
		for (let n of graph.nodes) {
			n.edges = n.edges.filter(x => x.targetId !== node.id);
		}
		graph.nodes = graph.nodes.filter(x => x.id !== node.id);

		await this.graphService.update(graph);
	}

	async removeEdge(edge: GraphEdge, graph: Graph) {
		for (let node of graph.nodes) {
			for (let outgoing of node.edges) {
				if (outgoing.id !== edge.id) {
					continue;
				}
				node.edges = node.edges.filter(x => x.id !== edge.id);
				await this.graphService.update(graph);
				return;
			}
		}
	}

	async addEdge(graph: Graph, from: GraphNode, to: GraphNode, label: string = ''): Promise<GraphEdge> {
		const edge: GraphEdge = {
			id: uuid(),
			name: label,
			targetId: to.id
		};
		from.edges.push(edge);

		await this.nameAllEdgesIfAnyAreLabeled(from, graph);
		return edge;
	}

	getNodes(graph: Graph): GraphNode[] {
		return graph.nodes;
	}

	getEdges(graph: Graph): GraphEdge[] {
		return flatten(graph.nodes.map(node => node.edges));
	}

	findNode(id: string, graph: Graph): GraphNode {
		const node = find(graph.nodes, (obj) => obj.id === id);
		if (!node) {
			throw new Error("Node not found");
		}
		return node;
	}

	findEdge(id: string, graph: Graph) : GraphEdge {
		for (let node of graph.nodes) {
			for (let edge of node.edges) {
				if (edge.id === id) {
					return edge;
				}
			}
		}
		throw Error("Edge not found");
	}

	async updateEdge(edge: GraphEdge, graph: Graph) {
		for (let node of graph.nodes) {
			const index = node.edges.findIndex(x => x.id === edge.id);
			node.edges[index] = edge;
			await this.nameAllEdgesIfAnyAreLabeled(node, graph);
		}
	}

	async updateNode(node: GraphNode, graph: Graph) {
		const index = graph.nodes.findIndex(x => x.id === node.id);
		graph.nodes[index] = node;
		await this.graphService.update(graph);
	}

	private async nameAllEdgesIfAnyAreLabeled(node: GraphNode, graph: Graph) {
		if (await GraphElementService.anyOutgoingEdgesHaveLabels(node)) {
			await this.renameAllUnnamedEdges(node, graph);
		}
	}

	private async renameAllUnnamedEdges(node: GraphNode, graph: Graph) {
		if (await GraphElementService.allOutgoingEdgesHaveLabels(node)) {
			return;
		}
		const edges = node.edges.filter(edge => edge.name.length === 0);
		if (edges.length === 0) {
			return;
		}
		for (let edge of edges) {
			edge.name = 'Unnamed edge ' + GraphElementService.unnamedEdgePlaceholderNumber++;
		}
		await this.graphService.update(graph);
	}

	private static async allOutgoingEdgesHaveLabels(node: GraphNode): Promise<boolean> {
		return node.edges.every(edge => edge.name !== '');
	}

	private static async anyOutgoingEdgesHaveLabels(node: GraphNode): Promise<boolean> {
		return node.edges.find(edge => edge.name !== '') !== undefined;
	}
}
