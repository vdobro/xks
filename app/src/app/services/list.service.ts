import {Injectable} from '@angular/core';

import {List} from "../models/List";
import {Deck} from "../models/Deck";
import {MockData} from "./mock-data";

@Injectable({
	providedIn: 'root'
})
export class ListService {

	constructor() {
	}

	public getById(id: string) : List {
		const result = MockData.sampleLists.filter(x => x.id === id);
		return result[0];
	}

	public getByDeck(deck: Deck) : List[] {
		return MockData.sampleLists.filter(x => x.deckId === deck.id);
	}
}
