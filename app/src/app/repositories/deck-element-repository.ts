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

import {Injectable} from "@angular/core";

import {ElementId} from "@app/models/ElementId";
import {DeckElement, DeckElementType} from "@app/models/DeckElement";

import {DeckRepository} from "@app/repositories/internal/deck-repository.service";
import {CouchDeckElementRepository, DeckElementData} from "@app/repositories/internal/couch-deck-element.repository";

import {UserSessionService} from "@app/services/user-session.service";
import {DeckService} from "@app/services/deck.service";
import {Deck} from "@app/models/Deck";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2021.07.15
 */
@Injectable({
	providedIn: 'root'
})
export class DeckElementRepository {

	private readonly deckRepos = new Map<string, CouchDeckElementRepository>();

	constructor(private readonly userSessionService: UserSessionService,
				private readonly deckService: DeckService,
				private readonly deckRepository: DeckRepository) {

		this.deckRepository.sourceChanged.subscribe(async () => {
			// TODO need for a mutex due to both event handlers below?
			this.deckRepos.clear();
			const decks = await this.deckRepository.getAll();
			for (let deck of decks) {
				this.addRepository(deck);
			}
		});
		this.deckRepository.entityCreated.subscribe(deck => {
			this.addRepository(deck);
		});
		this.deckRepository.entityDeleted.subscribe(deckId => {
			this.deckRepos.delete(deckId);
		});
	}

	async add(entity: DeckElement, type: DeckElementType) {
		await this.resolveDeckRepository(entity.deckId).add(entity, type);
	}

	async delete(id: ElementId) {
		await this.resolveDeckRepository(id.deck).delete(id.element);
	}

	async getAllByType(deckId: string, type: DeckElementType) : Promise<DeckElement[]> {
		return DeckElementRepository.mapToEntities(
			await this.resolveDeckRepository(deckId).getAllOfType(type),
			deckId
		);
	}

	async getById(id: ElementId): Promise<DeckElement> {
		const repository = this.resolveDeckRepository(id.deck);
		const element = await repository.getById(id.element);
		return DeckElementRepository.mapToEntity(element, id.deck);
	}

	async update(entity: DeckElement): Promise<DeckElement> {
		const updated = await this.resolveDeckRepository(entity.deckId).update(entity);
		return DeckElementRepository.mapToEntity(updated, entity.deckId);
	}

	async existAnyOfType(deckId: string, type: DeckElementType) : Promise<boolean> {
		return await this.resolveDeckRepository(deckId).existAnyOfType(type);
	}

	private addRepository(deck: Deck) {
		const repo = new CouchDeckElementRepository(deck, this.userSessionService);
		this.deckRepos.set(deck.id, repo);
	}

	private resolveDeckRepository(deck: string) : CouchDeckElementRepository {
		const repo = this.deckRepos.get(deck);
		if (!repo) {
			throw new Error("Deck element repository could not be resolved.");
		}
		return repo;
	}

	private static mapToEntities(data: DeckElementData[], deckId: string): DeckElement[] {
		return data.map(x => DeckElementRepository.mapToEntity(x, deckId));
	}

	private static mapToEntity(data: DeckElementData, deckId: string): DeckElement {
		return {
			...data,
			deckId: deckId
		}
	}
}
