import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {NavBarItem} from "../components/nav-bar-item";

@Injectable({
	providedIn: 'root'
})
export class NavigationService {

	private items: NavBarItem[] = [];

	private itemsObservable: Subject<NavBarItem[]> = new Subject();
	private topBarVisibleObservable: Subject<boolean> = new Subject();

	constructor() {
	}

	getAll(): Observable<NavBarItem[]> {
		return this.itemsObservable;
	}

	topNavBarVisible() : Observable<boolean> {
		return this.topBarVisibleObservable;
	}

	addItem(item: NavBarItem) {
		this.items.push(item);
		this.update();
	}

	clear() {
		this.items.length = 0;
		this.update();
	}

	setTopBarVisibility(show: boolean) {
		this.topBarVisibleObservable.next(show);
	}

	private update() {
		this.itemsObservable.next(this.items);
	}
}
