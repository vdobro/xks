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

import PouchDB from "pouchdb";
import {BaseDataEntity, BaseRepository} from "./BaseRepository";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.02
 */
export abstract class AbstractRepository<Entity extends { id: string }, DataEntity extends BaseDataEntity>
	implements BaseRepository<Entity> {

	private readonly dbName: string;
	protected readonly db: any;

	abstract mapToDataEntity(entity: Entity): DataEntity

	abstract mapToEntity(entity: DataEntity): Entity

	protected constructor(dbName: string) {
		this.dbName = dbName;
		this.db = new PouchDB(this.dbName);
	}

	async add(entity: Entity): Promise<void> {
		const dataEntity = this.mapToDataEntity(entity);
		delete dataEntity._rev;
		await this.db.put(dataEntity);
	}

	async delete(id: string): Promise<void> {
		const revision = await this.getRevision(id);
		await this.db.remove(id, revision);
	}

	async getAll(): Promise<Entity[]> {
		const allDocsResponse = await this.db.allDocs({
			include_docs: true
		});
		return allDocsResponse.rows.map((value) => this.mapToEntity(value.doc));
	}

	async getById(id: string): Promise<Entity> {
		const dataEntity = await this.getDataEntity(id);
		if (!dataEntity) {
			return null;
		}
		return this.mapToEntity(dataEntity);
	}

	async update(entity: Entity): Promise<Entity> {
		const revision = await this.getRevision(entity.id);

		const dataEntity = this.mapToDataEntity(entity);
		dataEntity._rev = revision;

		return await this.db.put(dataEntity);
	}

	async updateAll(entities: Entity[]) {
		const idMap = new Map<string, DataEntity>();
		entities.map((entity) => {
			const dataEntity = this.mapToDataEntity(entity);
			idMap.set(dataEntity._id, dataEntity);
		});
		const revisions = await this.db.allDocs({
			keys: entities.map(entity => entity.id)
		});
		for (let row of revisions.rows) {
			const id: string = row.id;
			const doc = idMap.get(id);
			doc._rev = row.value.rev;
			await this.db.put(doc);
		}
	}

	private async getRevision(id: string): Promise<string> {
		const dataEntity = await this.getDataEntity(id);
		return dataEntity._rev;
	}

	private async getDataEntity(id: string): Promise<DataEntity> {
		try {
			return await this.db.get(id);
		} catch (e) {
			console.log('Could not get document ' + id);
			return null;
		}
	}
}
