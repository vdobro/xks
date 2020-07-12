/*
 * Copyright (C) 2020 Vitalijus Dobrovolskis
 *
 * This file is part of xks.
 *
 * xks is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, version 3 of the License.
 *
 * xks is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with xks; see the file LICENSE. If not,
 * see <https://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {NavBarItemsDirective} from "../nav-bar-items.directive";
import {NavigationService} from "../../services/navigation.service";
import {NavBarItem} from "../nav-bar-item";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.23
 */
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
