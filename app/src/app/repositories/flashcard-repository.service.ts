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
import {Flashcard} from "../models/Flashcard";
import {BaseDataEntity} from "./BaseRepository";
import {UserSessionService} from "../services/user-session.service";
import {TableConfiguration} from "../models/TableConfiguration";
import {FlashcardSet} from "../models/FlashcardSet";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.11.15
 */
@Injectable({
	providedIn: 'root'
})
export class FlashcardRepository extends AbstractRepository<Flashcard, FlashcardDataEntity> {

	constructor(userSessionService: UserSessionService) {
		super('flashcard', userSessionService);
	}

	async getAllInSet(setId: string) : Promise<Flashcard[]> {
		await this.checkIndex();
		const result = await this.db.find({
			selector: {
				setId: setId
			}
		});
		return result.docs.map(this.mapToEntity);
	}

	async anyCardsExist(set: FlashcardSet) {
		await this.checkIndex();
		const result = await this.db.find({
			selector: {
				setId: set.id
			},
			limit: 1
		});
		return result.docs.length > 0;
	}

	protected mapToDataEntity(entity: Flashcard): FlashcardDataEntity {
		return {
			_id: entity.id,
			_rev: '',
			answerId: entity.answerId,
			setId: entity.setId,
			question: entity.question
		};
	}

	protected mapToEntity(entity: FlashcardDataEntity): Flashcard {
		return {
			id: entity._id,
			answerId: entity.answerId,
			setId: entity.setId,
			question: entity.question
		};
	}

	protected resolveRemoteDatabaseName(tableConfig: TableConfiguration): string {
		return tableConfig.flashcards;
	}

	protected getIndexFields(): string[] {
		return ['graphId'];
	}
}

interface FlashcardDataEntity extends BaseDataEntity {
	setId: string;
	question: string;
	answerId: string;
}
