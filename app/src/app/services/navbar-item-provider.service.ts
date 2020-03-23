import {Injectable} from '@angular/core';
import {NavBarItem} from "../components/top-bar/top-bar.component";
import {Observable, Subject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class NavbarItemProviderService {

	private items: NavBarItem[] = [];

	private itemsObservable: Subject<NavBarItem[]> = new Subject();

	constructor() {
	}

	getAll(): Observable<NavBarItem[]> {
		return this.itemsObservable;
	}

	addItem(item: NavBarItem) {
		this.items.push(item);
		this.update();
	}

	clear() {
		this.items.length = 0;
		this.update();
	}

	private update() {
		this.itemsObservable.next(this.items);
	}
}
