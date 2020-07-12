import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import UIkit from 'uikit';
import {Deck} from "../../models/Deck";
import {Observable} from "rxjs";
import {NavigationService} from "../../services/navigation.service";

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit, AfterViewInit {

	@ViewChild("offcanvas", {static: true})
	sideBar: ElementRef;

	deck$: Observable<Deck>;

	private active : boolean;

	constructor(private navigationService: NavigationService) {
		this.navigationService.sidebarVisible().subscribe((isVisible) => {
			this.active = (isVisible);
			this.update();
		});
		this.deck$ = this.navigationService.activeDeck();
	}

	ngAfterViewInit(): void {
	}

	ngOnInit(): void {
		UIkit.offcanvas(this.sideBar.nativeElement);
	}

	private update() : void {
		if (this.active) {
			UIkit.offcanvas(this.sideBar.nativeElement).show();
		} else {
			UIkit.offcanvas(this.sideBar.nativeElement).hide();
		}
	}
}
