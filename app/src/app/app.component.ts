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

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {NavigationControlService} from "./services/navigation-control.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.04
 */
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {

	title = 'xks';
	sidebarVisible: boolean = false;

	constructor(
		private readonly navControlService: NavigationControlService,
		private readonly cdr: ChangeDetectorRef) {

		this.navControlService.sidebarVisible().subscribe(visible => {
			if (this.sidebarVisible !== visible) {
				this.sidebarVisible = visible;
				this.cdr.detectChanges();
			}
		});
	}

	ngOnInit(): void {
	}
}
