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

import UIkit from 'uikit';

import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Table} from "../../models/Table";
import {NavigationService} from "../../services/navigation.service";
import {TableSessionModeWizardComponent} from "../table-session-mode-wizard/table-session-mode-wizard.component";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.06
 */
@Component({
	selector: 'app-setup-table-session-modal',
	templateUrl: './setup-table-session-modal.component.html',
	styleUrls: ['./setup-table-session-modal.component.sass']
})
export class SetupTableSessionModalComponent implements OnInit {

	@ViewChild("setupTableSessionModal")
	modal: ElementRef;

	@ViewChild(TableSessionModeWizardComponent)
	sessionModeWizard: TableSessionModeWizardComponent;

	@Input()
	table: Table;

	startSessionEnabled: boolean = false;

	constructor(
		private readonly navigationService: NavigationService) {
	}

	ngOnInit(): void {
	}

	async startSession() {
		if (this.table) {
			const mode = await this.sessionModeWizard.createSessionMode();
			await this.navigationService.studyTable(this.table.id, mode.id);
		}
	}

	openDialog() {
		UIkit.modal(this.modal.nativeElement).show();
	}
}