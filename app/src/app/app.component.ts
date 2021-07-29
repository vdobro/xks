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

import {AfterContentChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {NavigationControlService} from "./services/navigation-control.service";
import {NavigationService} from "./services/navigation.service";
import {DeckRepository} from "@app/repositories/deck-repository.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.03.04
 */
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit, AfterContentChecked {

	title = 'xks';
	sidebarVisible: boolean = false;

	@ViewChild('rootContainer', {static: true})
	rootContainer: ElementRef | undefined;

	constructor(
		private readonly deckRepository: DeckRepository,
		private readonly navigationService: NavigationService,
		private readonly navControlService: NavigationControlService,
		private readonly cdr: ChangeDetectorRef) {

		this.navControlService.sidebarVisible.subscribe(visible => {
			if (this.sidebarVisible !== visible) {
				this.sidebarVisible = visible;
				this.cdr.detectChanges();
			}
		});
		this.deckRepository.sourceChanged.subscribe(async () => {
			await this.navigationService.goHome();
		});
	}

	ngOnInit() {
	}

	ngAfterContentChecked() {
		if (!this.rootContainer) {
			return;
		}
		const width = this.rootContainer.nativeElement.offsetWidth;
		this.navControlService.notifyRootContainerChange(width);
	}
}
