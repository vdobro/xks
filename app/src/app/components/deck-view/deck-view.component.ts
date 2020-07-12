import {Component, OnDestroy, OnInit, Output} from '@angular/core';
import {Deck} from "../../models/Deck";
import {DeckService} from "../../services/deck.service";
import {ActivatedRoute} from "@angular/router";
import {NavigationService} from "../../services/navigation.service";

export const DECK_ID_PARAM: string = 'deckId';

@Component({
	selector: 'app-deck-view',
	templateUrl: './deck-view.component.html',
	styleUrls: ['./deck-view.component.sass']
})
export class DeckViewComponent implements OnInit, OnDestroy {

	@Output()
	deck: Deck;

	constructor(private deckService: DeckService,
				private route: ActivatedRoute,
				private navigationService: NavigationService) {
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			this.deck = this.deckService.getById(params.get(DECK_ID_PARAM));
			this.navigationService.populateSidebar(this.deck);
		});
	}

	ngOnDestroy() : void {
		this.navigationService.populateSidebar(null);
	}
}
