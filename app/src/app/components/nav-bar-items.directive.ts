import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
	selector: '[appNavBarItems]'
})
export class NavBarItemsDirective {
	constructor(public viewContainerRef: ViewContainerRef) {
	}
}
