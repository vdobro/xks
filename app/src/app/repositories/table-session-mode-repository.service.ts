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
import {TableSessionMode} from "../models/TableSessionMode";
import {BaseDataEntity} from "./BaseRepository";
import {Table} from "../models/Table";
import {UserSessionService} from "../services/user-session.service";
import {TableConfiguration} from "../models/TableConfiguration";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.16
 */
@Injectable({
	providedIn: 'root'
})
export class TableSessionModeRepository extends AbstractRepository<TableSessionMode, TableStudySessionModeDataEntity> {

	private indexCreated: boolean = false;

	constructor(userSessionService: UserSessionService) {
		super('table-study-session-mode', userSessionService);
	}

	async getByTable(table: Table): Promise<TableSessionMode[]> {
		const result = await this.getDataEntitiesByTable(table.id);
		return result.map(this.mapToEntity);
	}

	mapToDataEntity(entity: TableSessionMode): TableStudySessionModeDataEntity {
		return {
			_id: entity.id,
			_rev: '',
			tableId: entity.tableId,
			questionColumnIds: entity.questionColumnIds,
			answerColumnIds: entity.answerColumnIds,
		};
	}

	mapToEntity(entity: TableStudySessionModeDataEntity): TableSessionMode {
		return {
			id: entity._id,
			tableId: entity.tableId,
			questionColumnIds: entity.questionColumnIds,
			answerColumnIds: entity.answerColumnIds,
		};
	}

	protected resolveRemoteDatabaseName(tableConfig: TableConfiguration): string {
		return tableConfig.tableSessionModes;
	}

	private async getDataEntitiesByTable(tableId: string): Promise<TableStudySessionModeDataEntity[]> {
		await this.checkIndexesInitialized();
		const results = await this.db.find({
			selector: {
				$and: [
					{tableId: {$eq: tableId}},
				]
			},
			sort: [{tableId: 'asc'}]
		})
		return results.docs;
	}

	private async checkIndexesInitialized(): Promise<void> {
		if (this.indexCreated) {
			return;
		}
		await this.db.createIndex({
			index: {fields: ['tableId']}
		});
		this.indexCreated = true;
	}
}

interface TableStudySessionModeDataEntity extends BaseDataEntity {
	tableId: string,
	questionColumnIds: string[],
	answerColumnIds: string[],
}
