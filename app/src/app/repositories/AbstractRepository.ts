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
import PouchFind from "pouchdb-find";
import {UserSessionService} from "../services/user-session.service";
import {environment} from "../../environments/environment";
import {TableConfiguration} from "../models/TableConfiguration";
import {Subject, Subscribable} from "rxjs";
import {User} from "../models/User";
import {stripTrailingSlash} from "../../environments/utils";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.02
 */
export abstract class AbstractRepository<Entity extends { id: string }, DataEntity extends BaseDataEntity>
	implements BaseRepository<Entity> {

	private static pouchFindInitialized = false;

	private readonly _sourceChanged = new Subject<void>();
	readonly sourceChanged: Subscribable<void> = this._sourceChanged;

	protected db: any;
	private remoteSyncHandler: any;

	private readonly anonDb: any;
	private userDb: any;

	private readonly _entityCreated = new Subject<Entity>();
	private readonly _entityDeletedId = new Subject<string>();
	private readonly _entityUpdated = new Subject<Entity>();

	readonly entityCreated: Subscribable<Entity> = this._entityCreated;
	readonly entityDeleted: Subscribable<string> = this._entityDeletedId;
	readonly entityUpdated: Subscribable<Entity> = this._entityUpdated;

	protected abstract mapToDataEntity(entity: Entity): DataEntity

	protected abstract mapToEntity(entity: DataEntity): Entity

	protected constructor(
		private readonly localDbName: string,
		private readonly userSessionService: UserSessionService) {

		if (!AbstractRepository.pouchFindInitialized) {
			PouchDB.plugin(PouchFind);
			AbstractRepository.pouchFindInitialized = true;
		}
		this.anonDb = new PouchDB("anon-" + this.localDbName);
		this.switchToAnonDatabase().then(_ => this._sourceChanged.next());

		this.userSessionService.userChanged.subscribe(async user => {
			await this.userChangedHandler(user);
		});
	}

	async add(entity: Entity): Promise<void> {
		const dataEntity : {
			_rev?: string,
		} = this.mapToDataEntity(entity);
		delete dataEntity._rev;
		await this.db.put(dataEntity);
		this._entityCreated.next(entity);
	}

	async delete(id: string): Promise<void> {
		const revision = await this.getRevision(id);
		await this.db.remove(id, revision);
		this._entityDeletedId.next(id);
	}

	async getAll(): Promise<Entity[]> {
		const allDocsResponse = await this.db.allDocs({
			include_docs: true
		});
		return allDocsResponse.rows.map((value: { doc?: DataEntity; }) => this.mapToEntity(value.doc!!));
	}

	async getById(id: string): Promise<Entity> {
		const dataEntity = await this.getDataEntity(id);
		if (!dataEntity) {
			throw new Error('Could not find entity with id ' + id);
		}
		return this.mapToEntity(dataEntity);
	}

	async update(entity: Entity): Promise<Entity> {
		const revision = await this.getRevision(entity.id);

		const dataEntity = this.mapToDataEntity(entity);
		dataEntity._rev = revision;

		const result = await this.db.put(dataEntity);
		this._entityUpdated.next(this.mapToEntity(dataEntity));
		return result;
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
			const doc = idMap.get(id)!!;
			doc._rev = row.value.rev;
			await this.db.put(doc);
		}
	}

	protected abstract resolveRemoteDatabaseName(tableConfig: TableConfiguration): string;

	private async getRevision(id: string): Promise<string> {
		const dataEntity = await this.getDataEntity(id);
		return dataEntity._rev;
	}

	private async getDataEntity(id: string): Promise<DataEntity> {
		try {
			return await this.db.get(id);
		} catch (e) {
			throw new Error('Could not get document ' + id);
		}
	}

	private async userChangedHandler(user: User | null) {
		if (user) {
			const remoteName = this.resolveRemoteDatabaseName(user.tableConfig);
			this.userDb = new PouchDB(remoteName);
			const remoteUrl = stripTrailingSlash(environment.databaseUrl) + "/" + remoteName;
			const remoteDb = new PouchDB(remoteUrl, {
				fetch(url, opts) {
					// @ts-ignore
					opts.credentials = 'include';
					return PouchDB.fetch(url, opts);
				}
			});
			this.syncRemoteDb(remoteDb);
			this.db = this.userDb;
		} else {
			await this.switchToAnonDatabase();
		}
		this._sourceChanged.next();
	}

	private syncRemoteDb(remoteDb: PouchDB.Database<{}>) {
		this.remoteSyncHandler = this.userDb.sync(remoteDb, {
			live: true,
			retry: true,
		}).on('error', (err: string) => {
			console.log('(P|C)ouchDB sync error: ' + err);
		}).on('change', () => {
			this._sourceChanged.next();
		});
	}

	private async switchToAnonDatabase() {
		this.remoteSyncHandler?.cancel();
		this.db = this.anonDb;
		this.userDb = null;
	}
}
