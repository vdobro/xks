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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";

import {isTable} from "@app/models/Table";
import {isGraph} from "@app/models/graph";
import {isFlashcardList} from "@app/models/flashcard-set";

import {TableSessionMode} from "@app/models/TableSessionMode";
import {DeckElement} from "@app/models/DeckElement";

import {TableSessionService} from "@app/services/table-session.service";
import {SidebarService} from "@app/services/sidebar.service";
import {TopBarService} from "@app/services/top-bar.service";
import {StudySessionService} from "@app/services/study-session.service";
import {GraphSessionService} from "@app/services/graph-session.service";
import {GraphService} from "@app/services/graph.service";
import {FlashcardField} from "@app/services/models/flashcard-field";
import {TableService} from "@app/services/table.service";
import {NavigationService} from "@app/services/navigation.service";
import {TableSessionModeService} from "@app/services/table-session-mode.service";
import {LearningSessionState} from "@app/services/models/learning-session-state";

import {TABLE_ID_PARAM} from "@app/components/table-view/table-view.component";
import {NavBarItem} from "@app/components/nav-bar-item";
import {SessionNavigationComponent} from "@app/components/session-navigation/session-navigation.component";
import {GRAPH_ID_PARAM} from "@app/components/graph-view/graph-view.component";
import {DECK_ID_PARAM} from "@app/components/deck-view/deck-view.component";
import {FLASHCARD_SET_ID_PARAM} from "@app/components/flashcard-set-view/flashcard-set-view.component";
import {FlashcardSetService} from "@app/services/flashcard-set.service";
import {FlashcardSetSessionService} from "@app/services/flashcard-set-session.service";

export const TABLE_SESSION_MODE_ID_PARAM = "sessionModeId";
export const SESSION_START_SCORE_PARAM = "initial-score";
export const SESSION_MAX_SCORE_PARAM = "maximum-score";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.19
 */
@Component({
	selector: 'app-session-view',
	templateUrl: './session-view.component.html',
	styleUrls: ['./session-view.component.sass']
})
export class SessionViewComponent implements OnInit, OnDestroy {

	state: LearningSessionState | null = null;

	private deckElement: DeckElement | null = null;
	private sessionMode: TableSessionMode | null = null;

	private startScore: number = 0;
	private maxScore: number = 8;

	private sessionService: StudySessionService | null = null;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly tableService: TableService,
		private readonly graphService: GraphService,
		private readonly flashcardService: FlashcardSetService,
		private readonly navigationService: NavigationService,
		private readonly sessionModeService: TableSessionModeService,
		private readonly tableSessionService: TableSessionService,
		private readonly graphSessionService: GraphSessionService,
		private readonly flashcardSessionService: FlashcardSetSessionService,
		private readonly sidebarService: SidebarService,
		private readonly topBarService: TopBarService
	) {
		this.route.paramMap.subscribe(async (params: ParamMap) => {
			const tableId = params.get(TABLE_ID_PARAM);
			const tableSessionModeId = params.get(TABLE_SESSION_MODE_ID_PARAM);
			const graphId = params.get(GRAPH_ID_PARAM);
			const flashcardSetId = params.get(FLASHCARD_SET_ID_PARAM);
			const deckId = params.get(DECK_ID_PARAM);
			if (!deckId) {
				return;
			}

			const id = {
				element: (tableId || graphId || flashcardSetId)!,
				deck: deckId,
			}
			if (tableId && tableSessionModeId) {
				const table = await this.tableService.getById(id);
				this.deckElement = table;
				this.sessionMode = await this.sessionModeService.getById(tableSessionModeId, table);
				this.sessionService = this.tableSessionService;
			} else if (graphId) {
				this.deckElement = await this.graphService.getById(id);
				this.sessionService = this.graphSessionService;
			} else if (flashcardSetId) {
				this.deckElement = await this.flashcardService.getById(id);
				this.sessionService = this.flashcardSessionService;
			} else {
				await this.navigationService.goBack();
				return;
			}
			this.loadScores(params);

			this.initSession();
		});
	}

	async ngOnInit() {
	}

	ngOnDestroy() {
		this.topBarService.clearItems();
		this.tableSessionService.cleanup();
		this.graphSessionService.cleanup();
	}

	private loadScores(params: ParamMap) {
		const startScoreParam = params.get(SESSION_START_SCORE_PARAM);
		const maxScoreParam = params.get(SESSION_MAX_SCORE_PARAM);
		this.startScore = startScoreParam ? parseInt(startScoreParam)
			: this.deckElement!.defaultStartingScore;
		this.maxScore = maxScoreParam ? parseInt(maxScoreParam)
			: this.deckElement!.defaultMaxScore;
	}

	private initSession() {
		if (isTable(this.deckElement) && this.sessionMode) {
			this.state = this.tableSessionService.startNew(
				this.deckElement,
				this.sessionMode,
				this.startScore,
				this.maxScore);
		} else if (isGraph(this.deckElement)) {
			this.state = this.graphSessionService.startNew(this.deckElement,
				this.startScore, this.maxScore);
		} else if (isFlashcardList(this.deckElement)) {
			this.state = this.flashcardSessionService.startNew(this.deckElement,
				this.startScore, this.maxScore);
		}

		this.sidebarService.hide();
		this.topBarService.clearItems();
		this.topBarService.disableBackButton();
		this.topBarService.addItem(new NavBarItem(SessionNavigationComponent));
	}

	async onAnswer(event: { value: string, field: FlashcardField }) {
		if (!this.sessionService || !this.state) {
			return;
		}

		SessionViewComponent.clearNotifications();
		this.state = this.sessionService.submitAnswer(
			event.value, event.field.identifier.id, this.state);

		if (this.state.lastAnswer?.correct) {
			UIkit.notification("Correct", {status: 'success',});
		} else {
			UIkit.notification("Incorrect, correct answer was:\n"
				+ this.state?.lastAnswer?.expectedAnswer, {status: 'danger'});
		}
	}

	async onForceAcceptAnswer(currentInput: string) {
		if (!this.sessionService || !this.state) {
			return;
		}

		SessionViewComponent.clearNotifications();
		this.state = this.sessionService.acceptLastAnswer(currentInput, this.state);
		UIkit.notification("Answer accepted", {
			status: 'warning',
			timeout: 1000,
		});
	}

	private static clearNotifications() {
		// @ts-ignore
		UIkit.notification.closeAll();
	}
}

export interface ScoreParams {
	"initial-score": number,
	"maximum-score": number,
}
