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
import {TableService} from "../../services/table.service";
import {TableSessionModeRepository} from "../../repositories/table-session-mode-repository.service";
import {SessionScoreSettingsComponent} from "../session-score-settings/session-score-settings.component";
import {Graph} from "../../models/Graph";
import {DeckElement} from "../../models/DeckElement";
import {ScoreParams} from "../session-view/session-view.component";

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
	modal: ElementRef | undefined;

	@ViewChild(TableSessionModeWizardComponent)
	sessionModeWizard: TableSessionModeWizardComponent | undefined;

	@ViewChild(SessionModeChooserComponent)
	sessionModeChooser: SessionModeChooserComponent | undefined;

	@ViewChild(SessionScoreSettingsComponent)
	scoreSettingsComponent: SessionScoreSettingsComponent | undefined;

	@Input()
	set deckElement(val: DeckElement | null) {
		this._deckElement = val;
		if (!this._deckElement) {
			this.table = null;
			this.graph = null;
		}
		if (!this._deckElement) {
			return;
		}
		if (SessionSetupModalComponent.isTable(this._deckElement)) {
			this.table = this._deckElement;
			this.graph = null;
		} else if (SessionSetupModalComponent.isGraph(this._deckElement)) {
			this.graph = this._deckElement;
			this.table = null;
		} else {
			this.table = null;
			this.graph = null;
		}
	}

	table: Table | null = null;
	graph: Graph | null = null;
	_deckElement: DeckElement | null = null;

	anySessionModesAvailable: boolean = false;
	startSessionEnabled: boolean = false;
	useExisting: boolean = true;

	defaultSessionCheckbox = new FormControl('');

	constructor(
		private readonly navigationService: NavigationService,
		private readonly tableService: TableService,
		private readonly sessionModeService: TableSessionModeService,
		sessionModeRepository: TableSessionModeRepository) {

		sessionModeRepository.entityDeleted.subscribe(async _ => {
			await this.checkIfSessionModesExist();
		})
	}

	ngOnInit(): void {
	}

	async ngOnChanges(changes: SimpleChanges): Promise<void> {
		await this.checkIfSessionModesExist();
		this.validateConfiguration();
	}

	async startSession(): Promise<void> {
		if (!this._deckElement) {
			return;
		}
		await this.scoreSettingsComponent?.saveScoreSettings();
		const scores = this.getScoreParams(this._deckElement);

		if (this.table) {
			const modeId = await this.getSessionModeId();

			if (modeId) {
				await this.saveDefaultTableOptions(modeId);
				await this.navigationService.studyTable(this.table.id, modeId, scores);
			}
		} else if (this.graph) {
			await this.navigationService.studyGraph(this.graph.id, scores);
		}
	}

	openDialog(): void {
		if (!this.modal || !this._deckElement) {
			return;
		}
		UIkit.modal(this.modal.nativeElement).show();

		this.validateConfiguration();
	}

	validateConfiguration(): void {
		if (!this._deckElement) {
			this.startSessionEnabled = false;
			return;
		}
		if (this.table) {
			this.validateTableConfiguration(this.table);
		} else if (this.graph) {
			this.startSessionEnabled = true;
			this.defaultSessionCheckbox.enable();
		} else {
			this.startSessionEnabled = false;
			this.defaultSessionCheckbox.disable();
		}
	}

	private getScoreParams(deckElement: DeckElement): ScoreParams {
		return {
			"initial-score": this.scoreSettingsComponent?.startingScore || deckElement.defaultStartingScore,
			"maximum-score": this.scoreSettingsComponent?.maxScore || deckElement.defaultMaxScore
		};
	}

	private async checkIfSessionModesExist() {
		if (this.table) {
			this.anySessionModesAvailable = await this.sessionModeService.anyExist(this.table);
			if (!this.anySessionModesAvailable) {
				this.useExisting = false;
			}
		} else {
			this.anySessionModesAvailable = false;
		}
	}

	private async saveDefaultTableOptions(modeId: string) {
		if (!this.table) {
			return;
		}
		if (this.defaultSessionCheckbox.value || !this.anySessionModesAvailable) {
			const mode = await this.sessionModeService.getById(modeId);
			await this.sessionModeService.setAsDefault(mode);
		}
	}

	private async getSessionModeId(): Promise<string | null> {
		if (this.useExisting) {
			return this.sessionModeChooser?.currentSelection?.id || null;
		} else {
			const mode = await this.sessionModeWizard!!.createSessionMode();
			return mode.id;
		}
	}

	private validateTableConfiguration(table: Table) {
		const selection = this.sessionModeChooser?.currentSelection;
		if (selection && this.useExisting) {
			this.startSessionEnabled = true;
			if (selection.id === table.defaultSessionModeId) {
				this.defaultSessionCheckbox.setValue(true);
				this.defaultSessionCheckbox.disable();
			} else {
				this.defaultSessionCheckbox.enable();
				this.defaultSessionCheckbox.setValue(false);
			}
		} else {
			this.defaultSessionCheckbox.enable();
			this.defaultSessionCheckbox.setValue(false);
			this.startSessionEnabled = this.sessionModeWizard?.configurationValid || false;
		}
	}

	private static isTable(element: DeckElement | null): element is Table {
		if (!element) {
			return false;
		}
		return (element as Table).sessionModeIds !== undefined;
	}

	private static isGraph(element: DeckElement | null): element is Graph {
		if (!element) {
			return false;
		}
		return (element as Table).sessionModeIds === undefined;
	}
}
