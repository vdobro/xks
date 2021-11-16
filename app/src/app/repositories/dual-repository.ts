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

import {Subject, Subscribable} from "rxjs";

import {User} from "@app/models/user";

import {BaseRepository} from "@app/repositories/base-repository";
import {CouchDbRepository} from "@app/repositories/internal/couch-db-repository";
import {IdEntity} from "@app/repositories/id-entity";
import {LocalRepository} from "@app/repositories/internal/local-repository";
import {RemoteRepository} from "@app/repositories/internal/remote-repository";
import {EntityChangeSource, EntityChangeSubscription} from "@app/repositories/entity-change-source";

import {UserSessionService} from "@app/services/user-session.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2021.07.29
 */
export class DualRepository<TEntity extends IdEntity>
	implements BaseRepository<TEntity>, EntityChangeSource<TEntity> {

	private selectedRepository: BaseRepository<TEntity>;
	private readonly localRepository: CouchDbRepository<TEntity>;
	private remoteRepository: CouchDbRepository<TEntity> | null = null;

	private readonly _sourceChanged = new Subject<void>();
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
		this.selectedRepository = this.localRepository;

		this.userSessionService.userChanged.subscribe({
			next: async (user: User | null) => {
				await this.userChangedHandler(user);
			}
		});

		this.entitySubscriptions = this.createChangeSubscription(this.localRepository);
	}

	public async add(entity: TEntity, type?: string): Promise<void> {
		await this.selectedRepository.add(entity, type);
	}

	public async delete(id: string): Promise<void> {
		await this.selectedRepository.delete(id);
	}

	public async getAll(): Promise<TEntity[]> {
		return await this.selectedRepository.getAll();
	}

	public async getById(id: string): Promise<TEntity> {
		return await this.selectedRepository.getById(id);
	}

	public async update(entity: TEntity): Promise<TEntity> {
		return await this.selectedRepository.update(entity);
	}

	public async destroy(): Promise<void> {

	}

	private async userChangedHandler(user: User | null): Promise<void> {
		if (user) {
			await this.initRemoteDatabase(user);
			this.selectedRepository = this.remoteRepository!;
			this.forwardEntityChanges(this.remoteRepository!);
		} else {
			await this.remoteRepository?.close();
			this.remoteRepository = null;
			this.selectedRepository = this.localRepository;
			this.forwardEntityChanges(this.localRepository);
		}
		this._sourceChanged.next();
	}

	private createChangeSubscription(source: EntityChangeSource<TEntity>): EntityChangeSubscription<TEntity> {
		return {
			entityCreated: source.entityCreated.subscribe({
				next: (entity: TEntity) => {
					this._entityCreated.next(entity);
				}
			}),
			entityDeleted: source.entityDeleted.subscribe({
				next: (entityId: string) => {
					this._entityDeleted.next(entityId);
				}
			}),
			entityUpdated: source.entityUpdated.subscribe({
				next: (entity: TEntity) => {
					this._entityUpdated.next(entity);
				}
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
		this.remoteRepository = new RemoteRepository<TEntity>(remoteName);
		this.forwardEntityChanges(this.remoteRepository);
	}
}
