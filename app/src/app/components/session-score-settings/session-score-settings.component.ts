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

import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";

import {DeckElement} from "@app/models/deck-element";
import {DeckElementService} from "@app/services/deck-element.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.10.11
 */
@Component({
	selector: 'app-session-score-settings',
	templateUrl: './session-score-settings.component.html',
	styleUrls: ['./session-score-settings.component.sass']
})
export class SessionScoreSettingsComponent implements OnInit, OnChanges {

	@Input()
	deckElement: DeckElement | null = null;

	startingScore: number = 3;
	maxScore: number = 8;

	startingScoreRange: FormControl<number> = new FormControl(this.startingScore, { nonNullable: true });
	maximumScoreRange: FormControl<number> = new FormControl(this.maxScore, { nonNullable: true });
	saveSettingsCheckbox: FormControl<boolean> = new FormControl(false, { nonNullable: true });

	constructor(private readonly deckElementService: DeckElementService) {
	}

	ngOnInit(): void {
	}

	ngOnChanges(): void {
		this.loadScores();
	}

	loadScores(): void {
		if (!this.deckElement) {
			return;
		}
		this.startingScore = this.deckElement.defaultStartingScore;
		this.maxScore = this.deckElement.defaultMaxScore;

		this.startingScoreRange.setValue(this.startingScore);
		this.maximumScoreRange.setValue(this.maxScore);
	}

	onMaxScoreChanged(): void {
		this.maxScore = this.maximumScoreRange.value;
		this.startingScore = Math.min(this.startingScore, this.maxScore - 1);
	}

	onStartScoreChanged(): void {
		this.startingScore = this.startingScoreRange.value;
	}

	async saveScoreSettings(): Promise<void> {
		if (!this.deckElement || !this.saveSettingsCheckbox.value) {
			return;
		}
		await this.deckElementService.setDefaultStartingScore(this.deckElement, this.startingScore);
		await this.deckElementService.setDefaultMaximumScore(this.deckElement, this.maxScore);
	}
}
