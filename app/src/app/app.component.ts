import {Component, OnInit, ViewChild} from '@angular/core';

import {Deck} from "./models/Deck";
import {DeckService} from "./deck.service";
import {DeckListViewComponent} from "./components/deck-list-view/deck-list-view.component";


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
	title = 'xks';

	@ViewChild(DeckListViewComponent)
	deckListView;

	decks: Deck[] = this.deckService.getAll();

	constructor(private deckService: DeckService) {
	}

	ngOnInit(): void {
	}

	onNewDeckCreated(deck: Deck) {
		this.deckListView.onNewDeckCreated();
	}

	onDeckSelected(deck: Deck) {

	}
}
