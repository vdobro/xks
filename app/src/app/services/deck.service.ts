import {Injectable} from '@angular/core';
import {Deck} from "../models/Deck";
import {TableService} from "./table.service";
import {v4 as uuid} from 'uuid';
import {MockData} from "./mock-data";

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
