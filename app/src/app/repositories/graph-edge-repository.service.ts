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

import {Injectable} from '@angular/core';
import {BaseDataEntity} from "./BaseRepository";
import {AbstractRepository} from "./AbstractRepository";
import {GraphEdge} from "../models/GraphEdge";
import {UserSessionService} from "../services/user-session.service";
import {TableConfiguration} from "../models/TableConfiguration";
import {GraphNode} from "../models/GraphNode";
import {Graph} from "../models/Graph";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.12
 */
@Injectable({
	providedIn: 'root'
})
export class GraphEdgeRepository extends AbstractRepository<GraphEdge, GraphEdgeDataEntity> {

	private indexCreated: boolean = false;

	constructor(userSessionService: UserSessionService) {
		super('graph-edge', userSessionService);
	}

	async getAllInGraph(graph: Graph): Promise<GraphEdge[]> {
		await this.checkIndexes();
		const result = await this.db.find({
			selector: {
				graphId: graph.id
			}
		});
		return result.docs.map(this.mapToEntity);
	}

	async getAllTo(node: GraphNode): Promise<GraphEdge[]> {
		await this.checkIndexes();
		const result = await this.db.find({
			selector: {
				sourceNodeId: node.id
			}
		});
		return result.docs.map(this.mapToEntity);
	}

	async getAllFrom(node: GraphNode): Promise<GraphEdge[]> {
		await this.checkIndexes();
		const result = await this.db.find({
			selector: {
				targetNodeId: node.id
			}
		});
		return result.docs.map(this.mapToEntity);
	}

	async deleteAllInGraph(graph: Graph) {
		const all = await this.getAllInGraph(graph);
		for (let edge of all) {
			await this.delete(edge.id);
		}
	}

	protected resolveRemoteDatabaseName(tableConfig: TableConfiguration): string {
		return tableConfig.graphEdges;
	}

	private async checkIndexes() {
		if (this.indexCreated) {
			return;
		}
		await this.db.createIndex({
			index: {fields: ['graphId']}
		});
		await this.db.createIndex({
			index: {fields: ['sourceNodeId']}
		});
		await this.db.createIndex({
			index: {fields: ['targetNodeId']}
		});
		this.indexCreated = true;
	}

	protected mapToDataEntity(entity: GraphEdge): GraphEdgeDataEntity {
		return {
			_id: entity.id,
			_rev: '',
			graphId: entity.graphId,
			name: entity.name,
			sourceNodeId: entity.sourceNodeId,
			targetNodeId: entity.targetNodeId
		};
	}

	protected mapToEntity(entity: GraphEdgeDataEntity): GraphEdge {
		return {
			id: entity._id,
			graphId: entity.graphId,
			name: entity.name,
			sourceNodeId: entity.sourceNodeId,
			targetNodeId: entity.targetNodeId
		};
	}
}

interface GraphEdgeDataEntity extends BaseDataEntity {
	graphId: string,
	sourceNodeId: string,
	name: string,
	targetNodeId: string,
}
