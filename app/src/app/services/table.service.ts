import {Injectable} from '@angular/core';

import {v4 as uuid} from 'uuid';
import {Table} from "../models/Table";
import {Deck} from "../models/Deck";
import {MockData} from "./mock-data";

@Injectable({
	providedIn: 'root'
})
export class TableService {

	private tables : Table[] = MockData.sampleTables;

	constructor() {
	}

	public getById(id: string) : Table {
		const results = this.tables.filter(x => x.id === id);
		return results[0];
	}

	public getByDeck(deck: Deck) : Table[] {
		return this.tables.filter(x => x.deckId === deck.id);
	}

	public create(deck: Deck, name: string) : Table {
		const table : Table = {
			id: uuid(),
			deckId: deck.id,
			name: name,
			columns: [],
			rows: []
		};
		this.tables.push(table);
		return table;
	}

	public delete(id: string) {
		this.tables = this.tables.filter(item => item.id !== id);
	}

	public update(table: Table) {
		//TODO
	}
}
