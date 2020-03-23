import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Deck} from "../../models/Deck";

import UIkit from 'uikit';
import {v4 as uuid} from 'uuid';
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
		if (this.nameInput.value.trim() === '') {
			return;
		}
		const newDeck: Deck = {
			name: this.nameInput.value,
			description: this.descriptionInput.value,
			id: uuid()
		};
		this.deckService.add(newDeck);

		this.clearForm();

		UIkit.modal(this.modal.nativeElement).hide();
		this.newDeck.emit();
	}

	private clearForm() {
		this.nameInput.reset();
		this.descriptionInput.reset();
	}
}
