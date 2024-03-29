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

import {DeckElement, DeckElementType} from "@app/models/DeckElement";

import {CouchDbRepository} from "@app/repositories/internal/couch-db-repository";
import {BaseRepository} from "@app/repositories/base-repository";
import {Deck} from "@app/models/Deck";
import {LocalRepository} from "@app/repositories/internal/local-repository";
import {RemoteRepository} from "@app/repositories/internal/remote-repository";
import {User} from "@app/models/User";

export type DeckElementData = Omit<DeckElement, "deckId">

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.12
 */
export abstract class CouchDeckElementRepository implements BaseRepository<DeckElementData> {
	private indexCreated: boolean = false;

	private readonly db;

	protected constructor(private readonly source: CouchDbRepository<DeckElementData>) {
		this.db = this.source.getHandle();
	}

	async getAllOfType(type: DeckElementType): Promise<DeckElementData[]> {
		await this.checkIndexes();
		const result = await this.db.find({
			selector: {
				type: type
			}
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

	async add(entity: DeckElementData, type: DeckElementType): Promise<void> {
		return await this.source.add(entity, type);
	}

	async delete(id: string): Promise<void> {
		await this.source.delete(id);
	}

	async getAll(): Promise<DeckElementData[]> {
		return await this.source.getAll();
	}

	async getById(id: string): Promise<DeckElementData> {
		return await this.source.getById(id);
	}

	async update(entity: DeckElementData): Promise<DeckElementData> {
		return await this.source.update(entity);
	}
}

export class LocalDeckElementRepository extends CouchDeckElementRepository {
	constructor(deck: Deck) {
		super(new LocalRepository<DeckElementData>(deck.id));
	}
}

export class RemoteDeckElementRepository extends CouchDeckElementRepository {
	constructor(deck: Deck, user: User) {
		super(new RemoteRepository<DeckElementData>(deck.id, user, deck.database));
	}
}
