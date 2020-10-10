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
import {Table} from "../models/Table";
import {BaseDataEntity} from "./BaseRepository";
import {UserSessionService} from "../services/user-session.service";
import {TableConfiguration} from "../models/TableConfiguration";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.02
 */
@Injectable({
	providedIn: 'root'
})
export class TableRepository extends AbstractRepository<Table, TableDataEntity> {
	private indexCreated: boolean = false;

	constructor(userSessionService: UserSessionService) {
		super('table', userSessionService);
	}

	async getByDeck(id: string): Promise<Table[]> {
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

	protected mapToDataEntity(entity: Table): TableDataEntity {
		return {
			_id: entity.id,
			_rev: '',
			name: entity.name,
			deckId: entity.deckId,
			sessionModes: entity.sessionModeIds,
			defaultSessionMode: entity.defaultSessionModeId,
			defaultMaxScore: entity.defaultMaxScore,
			defaultStartingScore: entity.defaultStartingScore,
		}
	}

	protected mapToEntity(entity: TableDataEntity): Table {
		return {
			id: entity._id,
			deckId: entity.deckId,
			name: entity.name,
			sessionModeIds: entity.sessionModes,
			defaultSessionModeId: entity.defaultSessionMode,
			defaultMaxScore: entity.defaultMaxScore,
			defaultStartingScore: entity.defaultStartingScore,
		}
	}

	protected resolveRemoteDatabaseName(tableConfig: TableConfiguration): string {
		return tableConfig.tables;
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

interface TableDataEntity extends BaseDataEntity {
	deckId: string;
	name: string;
	sessionModes: string[],
	defaultSessionMode: string | null,
	defaultMaxScore: number,
	defaultStartingScore: number,
}
