import {Component, ComponentFactoryResolver, OnInit, Type, ViewChild} from '@angular/core';
import {NavBarItemsDirective} from "../nav-bar-items.directive";
import {NavbarItemProviderService} from "../../services/navbar-item-provider.service";

export class NavBarItem {
	constructor(public component: Type<any>) {}
}

@Component({
	selector: 'app-top-bar',
	templateUrl: './top-bar.component.html',
	styleUrls: ['./top-bar.component.sass']
})
export class TopBarComponent implements OnInit {

	@ViewChild(NavBarItemsDirective, {static: true})
	navbarItems: NavBarItemsDirective;

	constructor(private componentFactoryResolver: ComponentFactoryResolver,
				private navbarItemProviderService: NavbarItemProviderService) {
	}

	ngOnInit(): void {
		this.navbarItemProviderService.getAll().subscribe((items) => {
			this.updateItemsList(items);
		});
	}

	updateItemsList(items: NavBarItem[]) {
		const viewContainerRef = this.navbarItems.viewContainerRef;
		viewContainerRef.clear();

		for(const item of items) {
			const componentFactory = this.componentFactoryResolver
				.resolveComponentFactory(item.component);
			viewContainerRef.createComponent(componentFactory);
		}
	}
}
