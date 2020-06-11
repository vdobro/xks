import {Injectable} from '@angular/core';
import {Deck} from "../models/Deck";
import {ListService} from "./list.service";
import {MockData} from "./mock-data";

@Injectable({
	providedIn: 'root'
})
export class DeckService {

	constructor(private listService: ListService) {
	}

	getById(id: string): Deck {
		return MockData.decks.find(x => x.id === id);
	}

	getAll(): Deck[] {
		return MockData.decks.map((deck) => {
			deck.listIds = this.listService.getByDeck(deck).map(list => list.id);
			return deck;
		});
	}

	add(deck: Deck): void {
		MockData.decks.push(deck);
	}
}
