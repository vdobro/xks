import {Deck} from "../models/Deck";
import {v4 as uuid} from 'uuid';
import {List} from "../models/List";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.06.11
 */

export namespace MockData {
	export const sampleDeck : Deck = {
		name: 'Deck with lists',
		id: 'ee07eb82-e7d9-47e4-9be8-4ccd4d7a18ae',
		description: "",
		listIds: []};
	export const decks: Deck[] = [
		sampleDeck,
		{name: 'Another deck', id: uuid(), description: "", listIds: []},
		{name: 'DBWT 1', id: uuid(), description: "Datenbanken und Webtechnologien 1 ", listIds: []},
		{name: 'Finnish 1', id: uuid(), description: " 23", listIds: []},
		{name: 'Deutsche Artikel', id: uuid(), description: "Vokabeln mit dem dazugehörigen Geschlecht", listIds: []},
		{name: 'Medieval Lithuania', id: uuid(), description: "Historic dates and persons", listIds: []},
		{name: 'Random things', id: uuid(), description: "", listIds: []},
		{name: 'Cat names', id: uuid(), description: "", listIds: [],},
		{name: 'Sumerian numbers', id: uuid(), description: "", listIds: []},
		{name: 'Friends\' phone numbers', id: uuid(), description: "4e5 lkjahsdf ", listIds: []},
	];
	export const sampleLists: List[] = [
		{
			id: '81c831f5-5e0f-4c9c-bebc-838096cbd2ad',
			deckId: sampleDeck.id,
			name: "Sample List",
			columns: [],
			rows: [],
		},
		{ id: '30abfe21-cc41-45b1-baa2-93f8acb856d9',
			name: "Another list",
			deckId: sampleDeck.id, columns: [], rows: [] },
		{ id: '65ed0bde-0572-419a-8a0f-3ef32e97bd1c',
			name: "Third list",
			deckId: sampleDeck.id, columns: [], rows: [] },
		{ id: 'fa083969-e077-44d9-ba6e-c1744acb565f',
			name: "Fourth list",
			deckId: sampleDeck.id, columns: [], rows: [] },
		{ id: 'bef7f348-3d2f-480a-8add-d5c877f6bb42',
			name: "Definitive list",
			deckId: sampleDeck.id, columns: [], rows: [] },
		{ id: '910c5c80-95a5-488f-9285-ee4899f7de3e',
			name: "The last list",
			deckId: sampleDeck.id, columns: [], rows: [] }
	];
}
