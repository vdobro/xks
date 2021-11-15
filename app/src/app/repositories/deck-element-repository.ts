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
import {Deck} from "@app/models/Deck";
import {User} from "@app/models/User";

import {
	CouchDeckElementRepository,
	DeckElementData,
	LocalDeckElementRepository,
	RemoteDeckElementRepository
} from "@app/repositories/internal/couch-deck-element.repository";

import {UserSessionService} from "@app/services/user-session.service";
import {DeckService} from "@app/services/deck.service";
import {find} from "lodash-es";

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
				private readonly deckService: DeckService) {
		this.deckService.decksChanged.subscribe(async (decks) => {
			await this.onDecksChanged(decks);
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

	private async onDecksChanged(decks: Deck[]) {
		// TODO need for a mutex due to both event handlers below and possible user change?

		const user = this.userSessionService.getCurrentUser();
		const newDecks = decks.filter(deck => !this.deckRepos.has(deck.id));

		for (let deck of newDecks) {
			if (this.deckRepos.get(deck.id)) {
				continue; //this assumes that a deck does not change its database
			}
			const repo = DeckElementRepository.createRepository(deck, user);
			this.deckRepos.set(deck.id, repo);
		}
		// Remove previously used decks not present in the updated list anymore
		for (let existingDeckId of this.deckRepos.keys()) {
			if (!find(decks, x => existingDeckId === x.id)) {
				this.deckRepos.delete(existingDeckId);
			}
		}
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

	private static createRepository(deck: Deck, user: User | null) : CouchDeckElementRepository {
		return user !== null
			? new RemoteDeckElementRepository(deck)
			: new LocalDeckElementRepository(deck);
	}
}
