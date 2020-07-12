import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TableService} from "../../services/table.service";
import {FormControl} from "@angular/forms";

import {Deck} from "../../models/Deck";
import {Table} from "../../models/Table";

import UIkit from 'uikit';

@Component({
	selector: 'app-new-table-modal',
	templateUrl: './new-table-modal.component.html',
	styleUrls: ['./new-table-modal.component.sass']
})
export class NewTableModalComponent implements OnInit {

	@ViewChild("newTableModal") modal: ElementRef;
	@Input() deck: Deck;
	@Output() tableCreated: EventEmitter<Table> = new EventEmitter<Table>();

	nameInput = new FormControl('');

	constructor(private tableService: TableService) {
	}

	ngOnInit(): void {
	}

	onSaveClick() {
		const name = this.nameInput.value.trim();
		if (name === '') {
			return;
		}
		const table = this.tableService.create(this.deck, this.nameInput.value);

		this.nameInput.reset();
		UIkit.modal(this.modal.nativeElement).hide();
		this.tableCreated.emit(table);
	}

	openDialog() {
		UIkit.modal(this.modal.nativeElement).show();
	}
}
