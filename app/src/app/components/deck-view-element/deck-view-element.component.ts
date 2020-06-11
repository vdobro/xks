import {Component, Input, OnInit, Output} from '@angular/core';
import {ListService} from "../../services/list.service";
import {List} from "../../models/List";

@Component({
	selector: 'li [deck-elements]',
	templateUrl: './deck-view-element.component.html',
	styleUrls: ['./deck-view-element.component.sass']
})
export class DeckViewElementComponent implements OnInit {

	@Input()
	listId: string;

	@Output()
	list: List;

	constructor(private listService: ListService) {
	}

	ngOnInit(): void {
		this.list = this.listService.getById(this.listId);
	}
}
