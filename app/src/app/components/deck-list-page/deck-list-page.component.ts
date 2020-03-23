import {Component, OnInit, ViewChild} from '@angular/core';
import {Deck} from "../../models/Deck";
import {DeckListViewComponent} from "../deck-list-view/deck-list-view.component";
import {DeckService} from "../../services/deck.service";
import {NavbarItemProviderService} from "../../services/navbar-item-provider.service";
import {NavBarItem} from "../top-bar/top-bar.component";
import {DeckListNavbarComponent} from "../deck-list-navbar/deck-list-navbar.component";

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
				private navbarItems: NavbarItemProviderService) {
	}

	ngOnInit(): void {
		this.navbarItems.addItem(new NavBarItem(DeckListNavbarComponent));
	}

	onNewDeckCreated() {
		this.deckListView.onNewDeckCreated();
	}
}
