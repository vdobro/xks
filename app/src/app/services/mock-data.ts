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

import {v4 as uuid} from 'uuid';

import {Deck} from "@app/models/Deck";
import {Table} from "@app/models/Table";

const sampleDeckId = 'ee07eb82-e7d9-47e4-9be8-4ccd4d7a18ae';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.06.11
 */
export namespace MockData {
	export const sampleTables: Table[] = [
		{
			id: '81c831f5-5e0f-4c9c-bebc-838096cbd2ad',
			deckId: sampleDeckId,
			name: "Sample List",
			defaultMaxScore: 8,
			defaultStartingScore: 3,
			defaultSessionModeId: null,
			columns: [],
			rows: [],
			sessionModes: [],
		},
		{
			id: '30abfe21-cc41-45b1-baa2-93f8acb856d9',
			name: "Another list",
			deckId: sampleDeckId,
			defaultMaxScore: 8,
			defaultStartingScore: 3,
			defaultSessionModeId: null,
			columns: [],
			rows: [],
			sessionModes: [],
		},
		{
			id: '65ed0bde-0572-419a-8a0f-3ef32e97bd1c',
			name: "Third list",
			deckId: sampleDeckId,
			defaultMaxScore: 8,
			defaultStartingScore: 3,
			defaultSessionModeId: null,
			columns: [],
			rows: [],
			sessionModes: [],
		},
		{
			id: 'fa083969-e077-44d9-ba6e-c1744acb565f',
			name: "Fourth list",
			deckId: sampleDeckId,
			defaultMaxScore: 8,
			defaultStartingScore: 3,
			defaultSessionModeId: null,
			columns: [],
			rows: [],
			sessionModes: [],
		},
		{
			id: 'bef7f348-3d2f-480a-8add-d5c877f6bb42',
			name: "Definitive list",
			deckId: sampleDeckId,
			defaultMaxScore: 8,
			defaultStartingScore: 3,
			defaultSessionModeId: null,
			columns: [],
			rows: [],
			sessionModes: [],
		},
		{
			id: '910c5c80-95a5-488f-9285-ee4899f7de3e',
			name: "The last list",
			deckId: sampleDeckId,
			defaultMaxScore: 8,
			defaultStartingScore: 3,
			defaultSessionModeId: null,
			columns: [],
			rows: [],
			sessionModes: [],
		}
	];
	export const sampleDeck: Deck = {
		name: 'Deck with lists',
		id: 'ee07eb82-e7d9-47e4-9be8-4ccd4d7a18ae',
		description: "",
		database: '',
	};
	export const decks: Deck[] = [
		sampleDeck,
		{name: 'Another deck', id: uuid(), description: "", database: ''},
		{name: 'DBWT 1', id: uuid(), description: "Datenbanken und Webtechnologien 1", database: ''},
		{name: 'Finnish 1', id: uuid(), description: " 23", database: ''},
		{name: 'Deutsche Artikel', id: uuid(), description: "Vokabeln mit dem dazugehörigen Geschlecht", database: ''},
		{name: 'Medieval Lithuania', id: uuid(), description: "Historic dates and persons", database: ''},
		{name: 'Random things', id: uuid(), description: "", database: ''},
		{name: 'Cat names', id: uuid(), description: "", database: ''},
		{name: 'Sumerian numbers', id: uuid(), description: "", database: ''},
		{name: 'Friends\' phone numbers', id: uuid(), description: "", database: ''},
	];
}
