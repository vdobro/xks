import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import UIkit from 'uikit';
import {Deck} from "../../models/Deck";
import {NavigationService} from "../../services/navigation.service";
import {Table} from "../../models/Table";
import {TableService} from "../../services/table.service";
import {NewTableModalComponent} from "../new-table-modal/new-table-modal.component";
import {Router} from "@angular/router";
import {DeckService} from "../../services/deck.service";

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit, AfterViewInit {

	@ViewChild("offcanvas", {static: true})
	sideBar: ElementRef;
	@ViewChild(NewTableModalComponent) newTableModal: NewTableModalComponent;

	deck: Deck;
	tables : Table[] = [];

	private active : boolean;

	constructor(private navigationService: NavigationService,
				private deckService: DeckService,
				private tableService: TableService,
				private router: Router) {
		this.navigationService.sidebarVisible().subscribe((isVisible) => {
			this.active = (isVisible);
			this.update();
		});
		this.navigationService.activeDeck().subscribe((deck) => {
			this.deck = deck;
			if (deck === null) {
				this.tables = [];
			} else {
				this.tables = deck.tableIds.map((id) => this.tableService.getById(id));
			}
		});
	}

	ngAfterViewInit(): void {
	}

	ngOnInit(): void {
		UIkit.offcanvas(this.sideBar.nativeElement);
	}

	onTableDeleted(tableId: string) : void {
		this.tables = this.tables.filter(item => item.id !== tableId);
	}

	onNewTableCreated(table: Table) : void {
		this.tables.push(table);
	}

	onDeckDeleted() : void {
		if (this.deck === null) {
			this.tables = [];
			return;
		}

		this.deckService.delete(this.deck);
		this.deck = null;
		this.tables = [];
		this.router.navigate(['/']);
	}

	private update() : void {
		if (this.active) {
			UIkit.offcanvas(this.sideBar.nativeElement).show();
		} else {
			UIkit.offcanvas(this.sideBar.nativeElement).hide();
		}
	}
}
