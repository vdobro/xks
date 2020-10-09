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

import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Table} from "../../models/Table";
import {NavigationService} from "../../services/navigation.service";
import {TableSessionModeWizardComponent} from "../table-session-mode-wizard/table-session-mode-wizard.component";
import {TableSessionModeService} from "../../services/table-session-mode.service";
import {SessionModeChooserComponent} from "../session-mode-chooser/session-mode-chooser.component";
import {FormControl} from "@angular/forms";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.06
 */
@Component({
	selector: 'app-setup-table-session-modal',
	templateUrl: './session-setup-modal.component.html',
	styleUrls: ['./session-setup-modal.component.sass']
})
export class SessionSetupModalComponent implements OnInit, OnChanges {

	@ViewChild("setupSessionModal")
	modal: ElementRef;

	@ViewChild(TableSessionModeWizardComponent)
	sessionModeWizard: TableSessionModeWizardComponent;

	@ViewChild(SessionModeChooserComponent)
	sessionModeChooser: SessionModeChooserComponent;

	@Input()
	table: Table;

	anySessionModesAvailable: boolean = false;
	startSessionEnabled: boolean = false;

	defaultSessionCheckbox = new FormControl('');
	useExisting: boolean = true;

	constructor(
		private readonly navigationService: NavigationService,
		private readonly sessionModeService: TableSessionModeService) {
	}

	ngOnInit(): void {
	}

	async ngOnChanges(changes: SimpleChanges): Promise<void> {
		if (this.table) {
			this.anySessionModesAvailable = await this.sessionModeService.anyExist(this.table);
		} else {
			this.anySessionModesAvailable = false;
		}
		this.validateConfiguration();
	}

	async startSession(): Promise<void> {
		if (!this.table) {
			return;
		}

		const modeId = await this.getSessionModeId();
		if (this.defaultSessionCheckbox.value || !this.anySessionModesAvailable) {
			const mode = await this.sessionModeService.getById(modeId);
			await this.sessionModeService.setAsDefault(mode);
		}
		await this.navigationService.studyTable(this.table.id, modeId);
	}

	openDialog(): void {
		UIkit.modal(this.modal.nativeElement).show();
	}

	private async getSessionModeId(): Promise<string> {
		if (this.useExisting) {
			return this.sessionModeChooser.currentSelection?.id;
		} else {
			const mode = await this.sessionModeWizard.createSessionMode();
			return mode.id;
		}
	}

	validateConfiguration(): void {
		if (!this.table) {
			this.startSessionEnabled = false;
			return;
		}
		const selection = this.sessionModeChooser?.currentSelection;
		if (selection && this.useExisting) {
			this.startSessionEnabled = true;
			if (selection.id === this.table.defaultSessionModeId) {
				this.defaultSessionCheckbox.setValue(true);
				this.defaultSessionCheckbox.disable();
			} else {
				this.defaultSessionCheckbox.enable();
				this.defaultSessionCheckbox.setValue(false);
			}
		} else {
			this.defaultSessionCheckbox.enable();
			this.defaultSessionCheckbox.setValue(false);
			this.startSessionEnabled = this.sessionModeWizard.configurationValid;
		}
	}
}
