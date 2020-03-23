import {Injectable} from '@angular/core';
import {v4 as uuid} from 'uuid';
import {Deck} from "../models/Deck";

@Injectable({
	providedIn: 'root'
})
export class DeckService {

	private static decks: Deck[] = [
		{name: 'pz', id: uuid(), description: ""},
		{name: 'ääßrgaeg', id: uuid(), description: ""},
		{name: 'ąčęėįšųūž', id: uuid(), description: "acvbaslcgbkaert 'erg dgfgkojhdrg lxcvb lkjahsdf "},
		{name: 'erg', id: uuid(), description: " 23"},
		{name: 'sdfsdf', id: uuid(), description: "32234"},
		{name: '3425', id: uuid(), description: "werwer 345345 fghsfghsfgh"},
		{name: 'sdfsdf', id: uuid(), description: ""},
		{
			name: ';+üäöl´´',
			id: uuid(),
			description: "retertlxcvb fgkojhdrg lxcvb lkjahs slcgbkaert 'erg dgfgkojhdrg lxcvb lkjahsdf "
		},
		{name: '4545645', id: uuid(), description: ""},
		{name: 'vnsfjh', id: uuid(), description: "cvbcvb"},
		{name: 'sdfsdf', id: uuid(), description: ""},
		{name: ';df135345´´', id: uuid(), description: "4e5 lkjahsdf "},
	];
	constructor() {
	}

	getById(id: string) : Deck {
		return DeckService.decks.find(x => x.id === id);
	}

	getAll(): Deck[] {
		return DeckService.decks;
	}

	add(deck: Deck): void {
		DeckService.decks.push(deck);
	}
}
