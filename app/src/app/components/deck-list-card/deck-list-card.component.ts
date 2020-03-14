import {Component, Input, OnInit} from '@angular/core';
import {Deck} from "../../models/Deck";
import {FormControl} from "@angular/forms";

@Component({
	selector: 'app-deck-list-card',
	templateUrl: './deck-list-card.component.html',
	styleUrls: ['./deck-list-card.component.sass']
})
export class DeckListCardComponent implements OnInit {

	@Input()
	deck: Deck;

	editMode: boolean = false;

	nameInput = new FormControl('');
	descriptionInput = new FormControl('');

	constructor() {
	}

	ngOnInit(): void {
		this.nameInput.setValue(this.deck?.name);
		this.descriptionInput.setValue(this.deck?.description);
	}

	onEditClicked() {
		this.editMode = true;
	}

	onChangesSubmit() {
		this.deck.name = this.nameInput.value;
		this.deck.description = this.descriptionInput.value;
		this.editMode = false;
	}
}
