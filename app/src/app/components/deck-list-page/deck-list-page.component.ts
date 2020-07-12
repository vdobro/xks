import {Component, OnInit, ViewChild} from '@angular/core';
import {Deck} from "../../models/Deck";
import {DeckListViewComponent} from "../deck-list-view/deck-list-view.component";
import {DeckService} from "../../services/deck.service";
import {NavigationService} from "../../services/navigation.service";
import {DeckListNavbarComponent} from "../deck-list-navbar/deck-list-navbar.component";
import {NavBarItem} from "../nav-bar-item";

@Component({
	selector: 'app-deck-list-page',
	templateUrl: './deck-list-page.component.html',
	styleUrls: ['./deck-list-page.component.sass']
})
export class DeckListPageComponent implements OnInit {

	@ViewChild(DeckListViewComponent)
	deckListView: DeckListViewComponent;

	decks : Deck[] = this.deckService.getAll();

	constructor(private deckService: DeckService,
				private navigationService: NavigationService) {
	}

	ngOnInit(): void {
		this.navigationService.clear();
		this.navigationService.addItem(new NavBarItem(DeckListNavbarComponent));
	}

	onNewDeckCreated() {
		this.deckListView.onNewDeckCreated();
		this.decks = this.deckService.getAll();
	}
}
