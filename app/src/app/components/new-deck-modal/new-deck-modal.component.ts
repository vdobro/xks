import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Deck} from "../../models/Deck";

import UIkit from 'uikit';
import {FormControl} from "@angular/forms";
import {DeckService} from "../../services/deck.service";

@Component({
	selector: 'app-new-deck-modal',
	templateUrl: './new-deck-modal.component.html',
	styleUrls: ['./new-deck-modal.component.sass']
})
export class NewDeckModalComponent implements OnInit {

	@ViewChild("newDeckModal") modal: ElementRef;
	@Output() newDeck = new EventEmitter<Deck>();

	nameInput = new FormControl('');
	descriptionInput = new FormControl('');

	constructor(private deckService: DeckService) {
	}

	ngOnInit(): void {
	}

	onSaveClick() {
		const name = this.nameInput.value.trim();
		if (name === '') {
			return;
		}
		const newDeck = this.deckService.create(name, this.descriptionInput.value);

		this.clearForm();
		UIkit.modal(this.modal.nativeElement).hide();
		this.newDeck.emit(newDeck);
	}

	private clearForm() {
		this.nameInput.reset();
		this.descriptionInput.reset();
	}
}
