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
import {Deck} from "../models/Deck";
import {AbstractRepository, BaseDataEntity} from "./BaseRepository";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.01
 */
@Injectable({
	providedIn: 'root'
})
export class DeckRepository extends AbstractRepository<Deck, DeckEntity> {

	constructor() {
		super('decks');
	}

	mapToDataEntity(entity: Deck) : DeckEntity {
		return {
			_id: entity.id,
			_rev: '',
			name: entity.name,
			description: entity.description
		};
	}

	mapToEntity(entity: DeckEntity): Deck {
		return {
			id: entity._id,
			name: entity.name,
			description: entity.description,
		};
	}
}

export interface DeckEntity extends BaseDataEntity {
	name: string;
	description: string
}
