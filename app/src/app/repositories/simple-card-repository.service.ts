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
import {SimpleCard} from "../models/SimpleCard";
import {BaseDataEntity} from "./BaseRepository";
import {UserSessionService} from "../services/user-session.service";
import {TableConfiguration} from "../models/TableConfiguration";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.11.15
 */
@Injectable({
	providedIn: 'root'
})
export class SimpleCardRepository extends AbstractRepository<SimpleCard, SimpleCardDataEntity> {

	constructor(userSessionService: UserSessionService) {
		super('simple-card', userSessionService);
	}

	protected mapToDataEntity(entity: SimpleCard): SimpleCardDataEntity {
		return {
			_id: entity.id,
			_rev: '',
			answerId: entity.answerId,
			listId: entity.listId,
			question: entity.question
		};
	}

	protected mapToEntity(entity: SimpleCardDataEntity): SimpleCard {
		return {
			id: entity._id,
			answerId: entity.answerId,
			listId: entity.listId,
			question: entity.question
		};
	}

	protected resolveRemoteDatabaseName(tableConfig: TableConfiguration): string {
		return tableConfig.simpleCards;
	}
}

interface SimpleCardDataEntity extends BaseDataEntity {
	listId: string;
	question: string;
	answerId: string;
}
