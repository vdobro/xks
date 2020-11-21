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
import {SimpleCardList} from "../models/SimpleCardList";
import {UserSessionService} from "../services/user-session.service";
import {TableConfiguration} from "../models/TableConfiguration";
import {DeckElementDataEntity} from "../models/DeckElement";
import {DeckElementTypes} from "../models/DeckElementTypes";
import {Table} from "../models/Table";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.11.15
 */
@Injectable({
	providedIn: 'root'
})
export class SimpleCardListRepository extends AbstractRepository<SimpleCardList, SimpleCardListDataEntity> {
	private indexCreated: boolean = false;

	constructor(userSessionService: UserSessionService) {
		super('simple-card-list', userSessionService);
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

	protected mapToDataEntity(entity: SimpleCardList): SimpleCardListDataEntity {
		return {
			_id: entity.id,
			_rev: '',
			name: entity.name,
			deckId: entity.deckId,
			defaultMaxScore: entity.defaultMaxScore,
			defaultStartingScore: entity.defaultStartingScore,
		};
	}

	protected mapToEntity(entity: SimpleCardListDataEntity): SimpleCardList {
		return {
			id: entity._id,
			name: entity.name,
			type: DeckElementTypes.SimpleCards,
			deckId: entity.deckId,
			defaultMaxScore: entity.defaultMaxScore,
			defaultStartingScore: entity.defaultStartingScore,
		};
	}

	protected resolveRemoteDatabaseName(tableConfig: TableConfiguration): string {
		return tableConfig.simpleCardLists;
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

interface SimpleCardListDataEntity extends BaseDataEntity, DeckElementDataEntity {
}
