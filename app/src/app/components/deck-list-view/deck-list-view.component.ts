import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { Deck } from "../../models/Deck";

import UIkit from 'uikit';

@Component({
	selector: 'app-deck-list-view',
	templateUrl: './deck-list-view.component.html',
	styleUrls: ['./deck-list-view.component.sass']
})
export class DeckListViewComponent implements OnInit {

	@ViewChild("deckListFooter") deckListFooter: ElementRef;

	@Input()
	decks: Deck[];

	constructor() {
	}

	ngOnInit(): void {
	}

	onNewDeckCreated() {
		UIkit.scroll(0).scrollTo(this.deckListFooter.nativeElement);
	}
}
