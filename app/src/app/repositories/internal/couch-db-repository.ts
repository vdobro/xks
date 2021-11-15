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
import PouchFind from "pouchdb-find";
import {Subject, Subscribable} from "rxjs";

import {environment} from "@environments/environment";
import {stripTrailingSlash} from "@environments/utils";

import {IdEntity} from "@app/repositories/id-entity";
import {BaseRepository} from "@app/repositories/base-repository";
import {EntityChangeSource} from "@app/repositories/entity-change-source";

type BaseDataEntity = {
	_id: string,
	_rev?: string,
	type?: string
}

type DataLayerEntity<T extends IdEntity> = BaseDataEntity & Omit<Partial<T>, keyof IdEntity>;

const ID_PREFIX = "xks-";
const ID_PREFIX_LENGTH = ID_PREFIX.length;

export type CouchDatabase<TEntity extends IdEntity> = PouchDB.Database<DataLayerEntity<TEntity>>;

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.02
 */
export abstract class CouchDbRepository<TEntity extends IdEntity>
	implements BaseRepository<TEntity>, EntityChangeSource<TEntity> {

	private static pouchFindInitialized = false;

	protected readonly db: CouchDatabase<TEntity>;

	private readonly _entityCreated = new Subject<TEntity>();
	private readonly _entityDeleted = new Subject<string>();
	private readonly _entityUpdated = new Subject<TEntity>();

	readonly entityCreated: Subscribable<TEntity> = this._entityCreated;
	readonly entityDeleted: Subscribable<string> = this._entityDeleted;
	readonly entityUpdated: Subscribable<TEntity> = this._entityUpdated;

	mapToEntity(dataEntity: DataLayerEntity<TEntity>): TEntity {
		let result: any = {
			...dataEntity,
			id: dataEntity._id.substring(ID_PREFIX_LENGTH)
		};
		delete result._id;
		delete result._rev;
		delete result.type;
		return result;
	}

	protected constructor(dbName: string, remote: boolean) {
		if (!CouchDbRepository.pouchFindInitialized) {
			PouchDB.plugin(PouchFind);
			CouchDbRepository.pouchFindInitialized = true;
		}
		this.db = remote
			? this.createRemoteDatabase(dbName)
			: new PouchDB(dbName);
	}

	async add(entity: TEntity, type: string): Promise<void> {
		const entityWithoutId: Omit<TEntity, keyof IdEntity> = {
			...entity,
			id: undefined
		};

		const dataEntity: DataLayerEntity<TEntity> = {
			...entityWithoutId,
			_id: ID_PREFIX + entity.id,
		};
		if (type) {
			dataEntity.type = type;
		}
		await this.db.put(dataEntity);
		this._entityCreated.next(entity);
	}

	async delete(id: string): Promise<void> {
		const entity = await this.getDataEntity(id);
		const revision = entity._rev!;
		await this.db.remove(ID_PREFIX + id, revision);
		this._entityDeleted.next(id);
	}

	async getAll(): Promise<TEntity[]> {
		const allDocsResponse = await this.db.allDocs({
			include_docs: true,
			startkey: ID_PREFIX,
		});
		return allDocsResponse.rows.map((value: { doc?: DataLayerEntity<TEntity>; }) => {
			const doc = value.doc!;
			return this.mapToEntity(doc);
		});
	}

	async getById(id: string): Promise<TEntity> {
		const dataEntity = await this.getDataEntity(id);
		if (!dataEntity) {
			throw new Error('Could not find entity with id ' + id);
		}
		return this.mapToEntity(dataEntity);
	}

	async update(entity: TEntity): Promise<TEntity> {
		const existingEntity = await this.getDataEntity(entity.id);

		let dataEntity: DataLayerEntity<TEntity> = {
			...entity,
			_id: existingEntity._id,
			_rev: existingEntity._rev,
			type: existingEntity.type,
			id: undefined,
		};

		const result = await this.db.put(dataEntity);
		result.id = entity.id; // The ID prefix has to be removed
		this._entityUpdated.next(entity);
		return entity;
	}

	async close(): Promise<void> {
		await this.db.close();
	}

	async destroy() {
		await this.db.destroy();
	}

	getHandle(): CouchDatabase<TEntity> {
		return this.db;
	}

	private createRemoteDatabase(dbName: string): CouchDatabase<TEntity> {
		const remoteUrl = stripTrailingSlash(environment.databaseUrl) + "/" + dbName;
		return new PouchDB<DataLayerEntity<TEntity>>(remoteUrl, {
			fetch(url, opts) {
				// @ts-ignore
				opts.credentials = 'include';
				return PouchDB.fetch(url, opts);
			}
		});
	}

	private async getDataEntity(id: string): Promise<DataLayerEntity<TEntity>> {
		try {
			return await this.db.get(ID_PREFIX + id);
		} catch (e) {
			throw new Error('Could not get document ' + id);
		}
	}
}
