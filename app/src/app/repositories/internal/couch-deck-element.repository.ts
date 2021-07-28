/*
 * Copyright (C) 2021 Vitalijus Dobrovolskis
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

import {User} from "@app/models/User";
import {DeckElement, DeckElementType} from "@app/models/DeckElement";

import {CouchDbRepository} from "@app/repositories/internal/couch-db-repository";

import {UserSessionService} from "@app/services/user-session.service";
import {Deck} from "@app/models/Deck";

export type DeckElementData = Omit<DeckElement, "deckId">

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.12
 */
export class CouchDeckElementRepository extends CouchDbRepository<DeckElementData> {
    private indexCreated: boolean = false;

	constructor(public readonly deck: Deck,
				userSessionService: UserSessionService) {
		super("deck_" + deck.id,
			userSessionService,
			deck.database);
	}

	async getAllOfType(type: DeckElementType) : Promise<DeckElementData[]> {
		await this.checkIndexes();
		const result = await this.db.find({
			selector: {
				type: type
			},
			limit: 1
		});
		return result.docs as DeckElementData[];
	}

	async existAnyOfType(type: DeckElementType): Promise<boolean> {
		return (await this.getAllOfType(type)).length > 0;
	}

	private async checkIndexes() {
		if (this.indexCreated) {
			return;
		}
		await this.db.createIndex({
			index: {fields: ['type']}
		});
		this.indexCreated = true;
	}

	protected resolveRemoteDatabaseName(user: User): string {
		throw new Error("Should never be invoked.");
	}
}
