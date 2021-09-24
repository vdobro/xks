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

import {BaseRepository} from "@app/repositories/base-repository";
import {CouchDbRepository} from "@app/repositories/internal/couch-db-repository";
import {UserSessionService} from "@app/services/user-session.service";
import {User} from "@app/models/User";
import {IdEntity} from "@app/repositories/id-entity";
import {LocalRepository} from "@app/repositories/internal/local-repository";
import {RemoteRepository} from "@app/repositories/internal/remote-repository";
import {Subject, Subscribable} from "rxjs";
import {EntityChangeSource, EntityChangeSubscription} from "@app/repositories/entity-change-source";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2021.07.29
 */
export class DualRepository<TEntity extends IdEntity>
	implements BaseRepository<TEntity>, EntityChangeSource<TEntity> {

	private selected: BaseRepository<TEntity>;
	private readonly localRepository: CouchDbRepository<TEntity>;
	private remoteRepository: CouchDbRepository<TEntity> | null = null;

	private readonly _sourceChanged = new Subject();
	readonly sourceChanged = this._sourceChanged.asObservable();

	private readonly _entityCreated = new Subject<TEntity>();
	private readonly _entityDeleted = new Subject<string>();
	private readonly _entityUpdated = new Subject<TEntity>();

	readonly entityCreated: Subscribable<TEntity> = this._entityCreated;
	readonly entityDeleted: Subscribable<string> = this._entityDeleted;
	readonly entityUpdated: Subscribable<TEntity> = this._entityUpdated;

	private entitySubscriptions: EntityChangeSubscription<TEntity>;

	constructor(
		private readonly entityIdentifier: string,
		private readonly remoteDatabaseNameResolver: (identifier: string, user: User) => string,
		private readonly userSessionService: UserSessionService) {

		this.localRepository = new LocalRepository<TEntity>(entityIdentifier);
		this.selected = this.localRepository;

		this.userSessionService.userChanged.subscribe(async user => {
			await this.userChangedHandler(user);
		});

		this.entitySubscriptions = this.createChangeSubscription(this.localRepository);
	}

	public async add(entity: TEntity, type?: string): Promise<void> {
		await this.selected.add(entity, type);
	}

	public async delete(id: string): Promise<void> {
		await this.selected.delete(id);
	}

	public async getAll(): Promise<TEntity[]> {
		return await this.selected.getAll();
	}

	public async getById(id: string): Promise<TEntity> {
		return await this.selected.getById(id);
	}

	public async update(entity: TEntity): Promise<TEntity> {
		return await this.selected.update(entity);
	}

	private async userChangedHandler(user: User | null): Promise<void> {
		if (user) {
			await this.initRemoteDatabase(user);
			this.selected = this.remoteRepository!!;
			this.forwardEntityChanges(this.remoteRepository!!);
		} else {
			await this.remoteRepository?.close();
			this.remoteRepository = null;
			this.selected = this.localRepository;
			this.forwardEntityChanges(this.localRepository);
		}
		this._sourceChanged.next();
	}

	private createChangeSubscription(source: EntityChangeSource<TEntity>) : EntityChangeSubscription<TEntity> {
		return {
			entityCreated: source.entityCreated.subscribe(entity => {
				this._entityCreated.next(entity);
			}),
			entityDeleted: source.entityDeleted.subscribe(next => {
				this._entityDeleted.next(next);
			}),
			entityUpdated: source.entityUpdated.subscribe(next => {
				this._entityUpdated.next(next);
			})
		}
	}

	private forwardEntityChanges(source: EntityChangeSource<TEntity> | null) {
		this.entitySubscriptions?.entityUpdated.unsubscribe();
		this.entitySubscriptions?.entityDeleted.unsubscribe();
		this.entitySubscriptions?.entityCreated.unsubscribe();
		if (!source) {
			return;
		}
		this.entitySubscriptions = this.createChangeSubscription(source);
	}

	private async initRemoteDatabase(user: User) {
		await this.remoteRepository?.close();
		const remoteName = this.remoteDatabaseNameResolver(this.entityIdentifier, user);
		this.remoteRepository = new RemoteRepository<TEntity>(this.entityIdentifier, user, remoteName);
		this.forwardEntityChanges(this.remoteRepository);
	}
}
