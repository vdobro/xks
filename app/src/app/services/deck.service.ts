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
import {TableService} from "./table.service";
import {v4 as uuid} from 'uuid';
import {MockData} from "./mock-data";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.14
 */
@Injectable({
	providedIn: 'root'
})
export class DeckService {

	private decks: Deck[] = MockData.decks;

	constructor(private listService: TableService) {
	}

	getById(id: string): Deck {
		return this.decks.find(x => x.id === id);
	}

	getAll(): Deck[] {
		return this.decks.map((deck) => {
			deck.tableIds = this.listService.getByDeck(deck).map(list => list.id);
			return deck;
		});
	}

	create(name: string, description: string): Deck {
		const newDeck: Deck = {
			id: uuid(),
			name: name,
			description: description,
			tableIds: [],
		};
		this.decks.push(newDeck);
		return newDeck;
	}

	update(deck: Deck) {
		//TODO
	}

	delete(deck: Deck) {
		this.decks = this.decks.filter(x => x.id !== deck.id);
	}
}
