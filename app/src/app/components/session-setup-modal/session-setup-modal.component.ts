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
import {FormControl} from "@angular/forms";

import {DeckElement} from "@app/models/DeckElement";
import {Table, isTable} from "@app/models/Table";
import {Graph, isGraph} from "@app/models/graph";
import {FlashcardSet, isFlashcardList} from "@app/models/flashcard-set";

import {NavigationService} from "@app/services/navigation.service";
import {TableSessionModeService} from "@app/services/table-session-mode.service";
import {TableService} from "@app/services/table.service";

import {ScoreParams} from "@app/components/session-view/session-view.component";
import {SessionScoreSettingsComponent} from "@app/components/session-score-settings/session-score-settings.component";
import {SessionModeChooserComponent} from "@app/components/session-mode-chooser/session-mode-chooser.component";
import {TableSessionModeWizardComponent} from "@app/components/table-session-mode-wizard/table-session-mode-wizard.component";

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
		if (!this.deckElement) {
			this.table = null;
			this.graph = null;
			this.flashcardList = null;
			return;
		}
		this.table = isTable(this.deckElement) ? this.deckElement : null;
		this.graph = isGraph(this.deckElement) ? this.deckElement : null;
		this.flashcardList = isFlashcardList(this.deckElement) ? this.deckElement : null;
	}

	get deckElement(): DeckElement | null {
		return this._deckElement;
	}

	_deckElement: DeckElement | null = null;

	table: Table | null = null;
	graph: Graph | null = null;
	flashcardList: FlashcardSet | null = null;

	anySessionModesAvailable: boolean = false;
	startSessionEnabled: boolean = false;
	useExisting: boolean = true;

	defaultSessionCheckbox = new FormControl('');

	constructor(
		private readonly navigationService: NavigationService,
		private readonly tableService: TableService,
		private readonly sessionModeService: TableSessionModeService) {

		sessionModeService.$modesChanged.subscribe(async _ => {
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
		if (!this.deckElement) {
			return;
		}
		await this.scoreSettingsComponent?.saveScoreSettings();
		const scores = this.getScoreParams(this.deckElement);

		if (isTable(this.deckElement)) {
			const modeId = await this.getSessionModeId();

			if (modeId) {
				await this.saveDefaultTableOptions(modeId);
				await this.navigationService.studyTable(this.deckElement, modeId, scores);
			}
		} else if (isGraph(this.deckElement)) {
			await this.navigationService.studyGraph(this.deckElement, scores);
		} else if (isFlashcardList(this.deckElement)) {
			const set = this.deckElement as FlashcardSet;
			await this.navigationService.studyFlashcards(set, scores);
		}
	}

	openDialog(): void {
		if (!this.modal || !this.deckElement) {
			return;
		}
		UIkit.modal(this.modal.nativeElement).show();

		this.validateConfiguration();
	}

	validateConfiguration(): void {
		if (!this.deckElement) {
			this.startSessionEnabled = false;
			return;
		}
		if (isTable(this.deckElement)) {
			this.validateTableConfiguration(this.deckElement);
		} else if (isGraph(this.deckElement) || isFlashcardList(this.deckElement)) {
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
		if (!isTable(this.deckElement)) {
			this.anySessionModesAvailable = false;
			return;
		}

		this.anySessionModesAvailable = this.deckElement.sessionModes.length > 0;
		if (!this.anySessionModesAvailable) {
			this.useExisting = false;
		}
	}

	private async saveDefaultTableOptions(modeId: string) {
		if (!isTable(this.deckElement)) {
			return;
		}
		if (this.defaultSessionCheckbox.value || !this.anySessionModesAvailable) {
			const mode = await this.sessionModeService.getById(modeId, this.deckElement);
			await this.sessionModeService.setAsDefault(mode, this.deckElement);
		}
	}

	private async getSessionModeId(): Promise<string | null> {
		if (this.useExisting) {
			return this.sessionModeChooser?.currentSelection?.id || null;
		} else {
			const mode = await this.sessionModeWizard!.createSessionMode();
			return mode.id;
		}
	}

	private validateTableConfiguration(table: Table) {
		const selection = this.sessionModeChooser?.currentSelection;
		if (selection && this.useExisting) {
			this.startSessionEnabled = true;
			if (selection.id === table.defaultSessionModeId
				|| table.sessionModes.length === 1) {
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
}
