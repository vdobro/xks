import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TableService} from "../../services/table.service";
import {Table} from "../../models/Table";

@Component({
	selector: 'li [deck-elements]',
	templateUrl: './deck-view-table-list-element.component.html',
	styleUrls: ['./deck-view-table-list-element.component.sass']
})
export class DeckViewTableListElement implements OnInit {

	@Input()
	table: Table;

	@Output()
	deleted: EventEmitter<Table> = new EventEmitter<Table>();

	@Output()
	edited: EventEmitter<Table> = new EventEmitter<Table>();

	constructor(private tableService: TableService) {
	}

	ngOnInit(): void {

	}

	onDeleteClicked() : void {
		this.tableService.delete(this.table.id);
		this.deleted.emit(this.table);
	}

	onEditClicked() : void {
		this.tableService.update(this.table);
		this.edited.emit(this.table);
	}
}
