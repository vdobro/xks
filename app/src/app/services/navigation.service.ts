import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {NavBarItem} from "../components/nav-bar-item";
import {Deck} from "../models/Deck";

@Injectable({
	providedIn: 'root'
})
export class NavigationService {

	private items: NavBarItem[] = [];

	private itemsObservable: Subject<NavBarItem[]> = new Subject();
	private topBarVisible$: Subject<boolean> = new Subject();
	private sidebarVisible$: Subject<boolean> = new Subject();
	private activeDeck$: Subject<Deck> = new Subject();

	constructor() {
	}

	getAll(): Observable<NavBarItem[]> {
		return this.itemsObservable;
	}

	topNavBarVisible() : Observable<boolean> {
		return this.topBarVisible$;
	}

	sidebarVisible() : Observable<boolean> {
		return this.sidebarVisible$;
	}

	activeDeck() : Observable<Deck> {
		return this.activeDeck$;
	}

	addItem(item: NavBarItem) {
		this.items.push(item);
		this.update();
	}

	clear() {
		this.items.length = 0;
		this.update();
	}

	populateSidebar(deck: Deck) {
		let topBarVisible = deck === null;
		this.setTopBarVisibility(topBarVisible);
		this.activeDeck$.next(deck);
	}

	private setTopBarVisibility(show: boolean) {
		this.sidebarVisible$.next(!show);
		this.topBarVisible$.next(show);
	}

	private update() {
		this.itemsObservable.next(this.items);
	}
}
