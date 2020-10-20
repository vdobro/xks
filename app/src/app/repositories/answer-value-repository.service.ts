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
import {AnswerValue} from "../models/AnswerValue";
import {UserSessionService} from "../services/user-session.service";
import {TableConfiguration} from "../models/TableConfiguration";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.10.20
 */
@Injectable({
	providedIn: 'root'
})
export class AnswerValueRepository extends AbstractRepository<AnswerValue, AnswerValueEntity>{

	constructor(userSessionService: UserSessionService) {
		super('answer-value', userSessionService);
	}

	protected mapToDataEntity(entity: AnswerValue): AnswerValueEntity {
		return {
			_id: entity.id,
			_rev: '',
			defaultValue: entity.defaultValue,
			alternatives: entity.alternatives,
		};
	}

	protected mapToEntity(entity: AnswerValueEntity): AnswerValue {
		return {
			id: entity._id,
			defaultValue: entity.defaultValue,
			alternatives: entity.alternatives,
		};
	}

	protected resolveRemoteDatabaseName(tableConfig: TableConfiguration): string {
		return tableConfig.answerValues;
	}
}

interface AnswerValueEntity extends BaseDataEntity {
	defaultValue: string,
	alternatives: string[],
}
