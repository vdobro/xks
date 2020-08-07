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

import {Injectable} from '@angular/core';
import {Deck} from "../models/Deck";
import {v4 as uuid} from 'uuid';
import {DeckRepository} from "../repositories/deck-repository.service";
import {TableService} from "./table.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.14
 */
@Injectable({
	providedIn: 'root'
})
export class DeckService {

	constructor(private repository: DeckRepository,
				private tableService: TableService) {
	}

	async getById(id: string): Promise<Deck> {
		return this.repository.getById(id);
	}

	async getAll(): Promise<Deck[]> {
		return this.repository.getAll();
	}

	async create(name: string, description: string): Promise<Deck> {
		const newDeck: Deck = {
			id: uuid(),
			name: name,
			description: description
		};
		await this.repository.add(newDeck);
		return newDeck;
	}

	async update(deck: Deck) {
		await this.repository.update(deck);
	}

	async delete(deck: Deck) {
		await this.tableService.deleteAllInDeck(deck);
		await this.repository.delete(deck.id);
	}
}
