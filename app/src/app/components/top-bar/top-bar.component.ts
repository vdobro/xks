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

import {Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavBarItemsDirective} from "../nav-bar-items.directive";
import {NavigationControlService} from "../../services/navigation-control.service";
import {NavBarItem} from "../nav-bar-item";
import {NavigationService} from "../../services/navigation.service";
import {TopBarService} from "../../services/top-bar.service";
import {UserSessionService} from "../../services/user-session.service";
import {LoginModalComponent} from "../login-modal/login-modal.component";

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
	navBarItems: NavBarItemsDirective | undefined;

	@ViewChild(LoginModalComponent, {static: true})
	loginModal: LoginModalComponent | undefined;

	active: boolean = true;

	backNavigationEnabled = true;
	backButtonLabel = '';

	loginEnabled: boolean = true;

	private componentRefs: ComponentRef<any>[] = []

	constructor(
		private readonly componentFactoryResolver: ComponentFactoryResolver,
		private readonly navControlService: NavigationControlService,
		private readonly topBarService: TopBarService,
		private readonly navigationService: NavigationService,
		private readonly userSessionService: UserSessionService) {

		this.userSessionService.userLoggedIn.subscribe(value =>
			this.updateUserSessionControls(value));
	}

	ngOnInit(): void {
		this.navControlService.topBarVisible.subscribe((isVisible) => {
			if (this.active !== isVisible) {
				this.active = isVisible;
			}
		});
		this.topBarService.allItems.subscribe((items) => {
			this.updateItemsList(items);
		});
		this.topBarService.backNavigationEnabled.subscribe((value) => {
			if (this.backNavigationEnabled !== value) {
				this.backNavigationEnabled = value;
			}
		});
		this.topBarService.backButtonLabel.subscribe(value => {
			if (this.backButtonLabel !== value) {
				this.backButtonLabel = value;
			}
		});
	}

	ngOnDestroy() {
		this.componentRefs.forEach(ref => ref.destroy());
	}

	openLoginDialog() {
		if (!this.loginModal) {
			return;
		}
		this.loginModal.existingUser = true;
		this.loginModal.openDialog();
	}

	openRegisterDialog() {
		if (!this.loginModal) {
			return;
		}
		this.loginModal.existingUser = false;
		this.loginModal.openDialog();
	}

	async goHome() {
		await this.navigationService.goHome();
	}

	async goBack() {
		await this.navigationService.goBack();
	}

	async logout() {
		await this.userSessionService.logout();
	}

	private updateItemsList(items: NavBarItem[]) {
		const viewContainerRef = this.navBarItems!!.viewContainerRef;
		viewContainerRef.clear();

		for (const item of items) {
			const componentFactory = this.componentFactoryResolver
				.resolveComponentFactory(item.component);
			const componentRef = viewContainerRef.createComponent(componentFactory);
			this.componentRefs.push(componentRef);
		}
	}

	private updateUserSessionControls(userLoggedIn: boolean) {
		const shouldLoginBeEnabled = !userLoggedIn;
		if (this.loginEnabled !== shouldLoginBeEnabled) {
			this.loginEnabled = shouldLoginBeEnabled;
		}
	}
}
