import {
	Component,
	ComponentFactoryResolver,
	ComponentRef,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import {NavBarItemsDirective} from "../nav-bar-items.directive";
import {NavigationService} from "../../services/navigation.service";
import {NavBarItem} from "../nav-bar-item";

@Component({
	selector: 'app-top-bar',
	templateUrl: './top-bar.component.html',
	styleUrls: ['./top-bar.component.sass']
})
export class TopBarComponent implements OnInit, OnDestroy {

	@ViewChild(NavBarItemsDirective, {static: true})
	navBarItems: NavBarItemsDirective;

	@Output()
	active: boolean = true;

	private componentRefs : ComponentRef<any>[] = []

	constructor(private componentFactoryResolver: ComponentFactoryResolver,
				private navigationService: NavigationService) {
	}

	ngOnInit(): void {
		this.navigationService.topNavBarVisible().subscribe((isVisible) => {
			this.active = (isVisible);
		});
		this.navigationService.getAll().subscribe((items) => {
			this.updateItemsList(items);
		});
	}

	ngOnDestroy() {
		this.componentRefs.forEach(ref => ref.destroy());
	}

	private updateItemsList(items: NavBarItem[]) {
		const viewContainerRef = this.navBarItems.viewContainerRef;
		viewContainerRef.clear();

		for(const item of items) {
			const componentFactory = this.componentFactoryResolver
				.resolveComponentFactory(item.component);
			const componentRef = viewContainerRef.createComponent(componentFactory);
			this.componentRefs.push(componentRef);
		}
	}
}
