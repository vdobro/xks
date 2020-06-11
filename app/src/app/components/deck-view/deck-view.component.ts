import {Component, OnInit, Output} from '@angular/core';
import {Deck} from "../../models/Deck";
import {DeckService} from "../../services/deck.service";
import {ActivatedRoute} from "@angular/router";

export const DECK_ID_PARAM: string = 'deckId';

@Component({
	selector: 'app-deck-view',
	templateUrl: './deck-view.component.html',
	styleUrls: ['./deck-view.component.sass']
})
export class DeckViewComponent implements OnInit {

	@Output()
	deck: Deck;

	constructor(private deckService: DeckService,
				private route: ActivatedRoute) {
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			this.deck = this.deckService.getById(params.get(DECK_ID_PARAM));
		});
	}
}
