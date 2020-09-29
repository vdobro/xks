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

import {Injectable} from '@angular/core';
import {GraphNodeRepository} from "../repositories/graph-node-repository.service";
import {GraphEdgeRepository} from "../repositories/graph-edge-repository.service";
import {Graph} from "../models/Graph";
import {GraphNode} from "../models/GraphNode";
import {GraphEdge} from "../models/GraphEdge";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.14
 */
@Injectable({
	providedIn: 'root'
})
export class GraphElementService {
	private unnamedEdgeNumber : number = 1;

	constructor(private readonly nodeRepository: GraphNodeRepository,
				private readonly edgeRepository: GraphEdgeRepository) {

	}

	async addNode(graph: Graph, value: string): Promise<GraphNode> {
		const node: GraphNode = {
			graphId: graph.id,
			id: uuid(),
			value: value
		};
		await this.nodeRepository.add(node);
		return node;
	}

	async removeNode(node: GraphNode) {
		const outgoingEdges = await this.edgeRepository.getAllFrom(node);
		for (let edge of outgoingEdges) {
			await this.removeEdge(edge);
		}
		const incomingEdges = await this.edgeRepository.getAllTo(node);
		for (let edge of incomingEdges) {
			await this.edgeRepository.delete(edge.id);
		}
		await this.nodeRepository.delete(node.id);
	}

	async removeEdge(edge: GraphEdge) {
		await this.edgeRepository.delete(edge.id);
	}

	async addEdge(graph: Graph, from: GraphNode, to: GraphNode, label: string = ''): Promise<GraphEdge> {
		const edge: GraphEdge = {
			graphId: graph.id,
			id: uuid(),
			name: label,
			sourceNodeId: from.id,
			targetNodeId: to.id
		};
		await this.edgeRepository.add(edge);

		await this.nameAllEdgesIfAnyAreLabeled(from);
		return edge;
	}

	async removeAll(graph: Graph) {
		await this.edgeRepository.deleteAllInGraph(graph);
		await this.nodeRepository.deleteAllInGraph(graph);
	}

	async getNodes(graph: Graph): Promise<GraphNode[]> {
		return await this.nodeRepository.getAllInGraph(graph);
	}

	async getEdges(graph: Graph): Promise<GraphEdge[]> {
		return await this.edgeRepository.getAllInGraph(graph);
	}

	async getNodeById(id: string): Promise<GraphNode> {
		return await this.nodeRepository.getById(id);
	}

	async updateEdge(edge: GraphEdge) {
		await this.edgeRepository.update(edge);

		const from = await this.nodeRepository.getById(edge.sourceNodeId);
		await this.nameAllEdgesIfAnyAreLabeled(from);
	}

	private async nameAllEdgesIfAnyAreLabeled(node: GraphNode) {
		if (await this.anyOutgoingEdgesHaveLabels(node)) {
			await this.renameAllUnnamedEdges(node);
		}
	}

	private async renameAllUnnamedEdges(node: GraphNode) {
		if (await this.allOutgoingEdgesHaveLabels(node)) {
			return;
		}
		const edges = (await this.edgeRepository.getAllFrom(node)).filter(edge => edge.name === '');

		for (let edge of edges) {
			edge.name = 'Unnamed edge ' + this.unnamedEdgeNumber;
			this.unnamedEdgeNumber++;
			await this.edgeRepository.update(edge);
		}
	}

	private async allOutgoingEdgesHaveLabels(node: GraphNode) : Promise<boolean> {
		const edges = await this.edgeRepository.getAllFrom(node);
		return edges.every(edge => edge.name !== '');
	}

	private async anyOutgoingEdgesHaveLabels(node: GraphNode) : Promise<boolean> {
		const edges = await this.edgeRepository.getAllFrom(node);
		return edges.find(edge => edge.name !== '') !== undefined;
	}
}
