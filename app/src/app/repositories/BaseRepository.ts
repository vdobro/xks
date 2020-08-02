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

import PouchDB from 'pouchdb';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.01
 */
export interface BaseRepository<Entity> {
	getAll(): Promise<Entity[]>

	getById(id: string): Promise<Entity>

	add(entity: Entity): Promise<void>

	delete(id: string): Promise<void>

	update(entity: Entity): Promise<Entity>
}

export abstract class AbstractRepository<Entity extends { id: string }, DataEntity extends BaseDataEntity>
	implements BaseRepository<Entity> {

	private readonly dbName: string;
	private readonly db: any;

	abstract mapToDataEntity(entity: Entity): DataEntity

	abstract mapToEntity(entity: DataEntity): Entity

	protected constructor(dbName: string) {
		this.dbName = dbName;
		this.db = new PouchDB(this.dbName);
	}

	add(entity: Entity): Promise<void> {
		const dataEntity = this.mapToDataEntity(entity);
		delete dataEntity._rev;
		return this.db.put(dataEntity);
	}

	delete(id: string): Promise<void> {
		const that = this;
		return this.getRevision(id).then(function (rev) {
			return that.db.remove(id, rev);
		});
	}

	getAll(): Promise<Entity[]> {
		return this.db.allDocs().map(this.mapToEntity);
	}

	getById(id: string): Promise<Entity> {
		const that = this;
		return this.getDataEntity(id).then(function (result) {
			if (!result) {
				return null;
			}
			return that.mapToEntity(result);
		});
	}

	update(entity: Entity): Promise<Entity> {
		const that = this;
		return this.getRevision(entity.id).then(function (revision) {
			const dataEntity = that.mapToDataEntity(entity);
			dataEntity._rev = revision;
			return that.db.put(dataEntity);
		});
	}

	private getRevision(id: string): Promise<string> {
		return this.getDataEntity(id).then(function (result) {
			return result._rev;
		});
	}

	private getDataEntity(id: string): Promise<DataEntity> {
		return this.db.get(id);
	}
}

export interface BaseDataEntity {
	_id: string,
	_rev: string
}
