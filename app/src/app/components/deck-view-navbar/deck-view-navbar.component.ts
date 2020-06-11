import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationService} from "../../services/navigation.service";

import UIkit from 'uikit';
import {Deck} from "../../models/Deck";

@Component({
	selector: 'deck-view-navbar',
	templateUrl: './deck-view-navbar.component.html',
	styleUrls: ['./deck-view-navbar.component.sass']
})
export class DeckViewNavbarComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild("offcanvas", {static: true})
	sideBar: ElementRef;

	@Input()
	deck: Deck;

	constructor(private navigationService: NavigationService) {

	}

	ngAfterViewInit(): void {
		UIkit.offcanvas(this.sideBar.nativeElement).show();
	}

	ngOnInit(): void {
		this.navigationService.setTopBarVisibility(false);
	}

	ngOnDestroy() {
		this.navigationService.setTopBarVisibility(true);
	}

}
