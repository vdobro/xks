import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { Deck } from "../../models/Deck";

import UIkit from 'uikit';

@Component({
	selector: 'app-deck-list-view',
	templateUrl: './deck-list-view.component.html',
	styleUrls: ['./deck-list-view.component.sass']
})
export class DeckListViewComponent implements OnInit {

	@ViewChild("deckListFooter") deckListFooter: ElementRef;

	@Input() deckList: Deck[];
	@Output() deckSelected = new EventEmitter<Deck>();

	constructor() {
	}

	ngOnInit(): void {
	}

	onNewDeckCreated() {
		UIkit.scroll(0).scrollTo(this.deckListFooter.nativeElement);
	}
}
