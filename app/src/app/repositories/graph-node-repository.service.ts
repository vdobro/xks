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
import {GraphNode} from "../models/GraphNode";
import {UserSessionService} from "../services/user-session.service";
import {TableConfiguration} from "../models/TableConfiguration";
import {Graph} from "../models/Graph";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.12
 */
@Injectable({
	providedIn: 'root'
})
export class GraphNodeRepository extends AbstractRepository<GraphNode, GraphNodeDataEntity> {

	constructor(userSessionService: UserSessionService) {
		super('graph-node', userSessionService);
	}

	async getAllInGraph(graph: Graph): Promise<GraphNode[]> {
		await this.checkIndex();
		const results = await this.db.find({
			selector: {
				graphId: graph.id
			},
		})
		return results.docs.map(this.mapToEntity);
	}

	async deleteAllInGraph(graph: Graph) {
		const all = await this.getAllInGraph(graph);
		for (let node of all) {
			await this.delete(node.id);
		}
	}

	protected mapToDataEntity(entity: GraphNode): GraphNodeDataEntity {
		return {
			_id: entity.id,
			_rev: '',
			graphId: entity.graphId,
			valueId: entity.valueId,
		};
	}

	protected mapToEntity(entity: GraphNodeDataEntity): GraphNode {
		return {
			id: entity._id,
			graphId: entity.graphId,
			valueId: entity.valueId,
		};
	}

	protected resolveRemoteDatabaseName(config: TableConfiguration): string {
		return config.graphNodes;
	}

	protected getIndexFields() : string[] {
		return ['graphId'];
	}
}

interface GraphNodeDataEntity extends BaseDataEntity {
	graphId: string,
	valueId: string,
}
