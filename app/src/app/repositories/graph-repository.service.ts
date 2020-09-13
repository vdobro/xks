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
import {AbstractRepository} from "./AbstractRepository";
import {BaseDataEntity} from "./BaseRepository";
import {Graph} from "../models/Graph";
import {UserSessionService} from "../services/user-session.service";
import {TableConfiguration} from "../models/TableConfiguration";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.12
 */
@Injectable({
	providedIn: 'root'
})
export class GraphRepository extends AbstractRepository<Graph, GraphDataEntity> {

	private indexCreated: boolean = false;

	constructor(userSessionService: UserSessionService) {
		super('graph', userSessionService);
	}

	async getByDeck(id: string): Promise<Graph[]> {
		await this.checkIndexes();
		const result = await this.db.find({
			selector: {
				deckId: id
			}
		});
		return result.docs.map(this.mapToEntity);
	}

	async existAnyForDeck(id: string): Promise<boolean> {
		await this.checkIndexes();
		const result = await this.db.find({
			selector: {
				deckId: id
			},
			limit: 1
		});
		return result.docs.length > 0;
	}

	mapToDataEntity(entity: Graph): GraphDataEntity {
		return {
			_id: entity.id,
			_rev: '',
			deckId: entity.deckId,
			name: entity.name,
		};
	}

	mapToEntity(entity: GraphDataEntity): Graph {
		return {
			id: entity._id,
			deckId: entity.deckId,
			name: entity.name,
		};
	}

	protected resolveRemoteDatabaseName(tableConfig: TableConfiguration): string {
		return tableConfig.graphs;
	}

	private async checkIndexes() {
		if (this.indexCreated) {
			return;
		}
		await this.db.createIndex({
			index: {fields: ['deckId', 'name']}
		});
		this.indexCreated = true;
	}
}

interface GraphDataEntity extends BaseDataEntity {
	deckId: string,
	name: string,
}
