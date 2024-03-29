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

import {Component, OnInit} from '@angular/core';
import {NavigationService} from "@app/services/navigation.service";
import {SidebarService} from "@app/services/sidebar.service";
import {TopBarService} from "@app/services/top-bar.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.15
 */
@Component({
	selector: 'app-not-found-view',
	templateUrl: './not-found-view.component.html',
	styleUrls: ['./not-found-view.component.sass']
})
export class NotFoundViewComponent implements OnInit {

	constructor(
		private readonly sidebarService: SidebarService,
		private readonly topBarService: TopBarService,
		private readonly navigationService: NavigationService
	) {
	}

	public ngOnInit(): void {
		this.topBarService.clearItems();
		this.topBarService.setBackButtonLabel('Go home');

		this.sidebarService.deselectDeckElement();
		this.sidebarService.hide();
	}

	public async goHome(): Promise<void> {
		await this.navigationService.goHome();
	}
}
