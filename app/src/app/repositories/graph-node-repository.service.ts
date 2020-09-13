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

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.12
 */
@Injectable({
	providedIn: 'root'
})
export class GraphNodeRepository extends AbstractRepository<GraphNode, GraphNodeDataEntity> {

	private indexCreated: boolean = false;

	constructor(userSessionService: UserSessionService) {
		super('graph-node', userSessionService);
	}

	mapToDataEntity(entity: GraphNode): GraphNodeDataEntity {
		return {
			_id: entity.id,
			_rev: '',
			graphId: entity.graphId,
			value: entity.value,
		};
	}

	mapToEntity(entity: GraphNodeDataEntity): GraphNode {
		return {
			id: entity._id,
			graphId: entity.graphId,
			value: entity.value,
		};
	}

	protected resolveRemoteDatabaseName(config: TableConfiguration): string {
		return config.graphNodes;
	}

	private async checkIndexes() {
		if (this.indexCreated) {
			return;
		}
		await this.db.createIndex({
			index: {fields: ['graphId', 'value']}
		});
		this.indexCreated = true;
	}
}

interface GraphNodeDataEntity extends BaseDataEntity {
	graphId: string,
	value: string,
}
