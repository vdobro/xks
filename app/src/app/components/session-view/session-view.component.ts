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
import {TABLE_ID_PARAM} from "../table-view/table-view.component";
import {TableService} from "../../services/table.service";
import {TableSessionModeService} from "../../services/table-session-mode.service";
import {Table} from "../../models/Table";
import {TableSessionMode} from "../../models/TableSessionMode";
import {TableSessionService} from "../../services/table-session.service";
import {SidebarService} from "../../services/sidebar.service";
import {TopBarService} from "../../services/top-bar.service";
import {NavBarItem} from "../nav-bar-item";
import {SessionNavigationComponent} from "../session-navigation/session-navigation.component";
import {LearningSessionState, StudySessionService} from "../../services/study-session.service";
import {Graph} from "../../models/Graph";
import {GraphSessionService} from "../../services/graph-session.service";
import {GRAPH_ID_PARAM} from "../graph-view/graph-view.component";
import {GraphService} from "../../services/graph.service";
import {FlashcardField} from "../../services/exercise-task.service";
import {NavigationService} from "../../services/navigation.service";
import {DeckElement} from "../../models/DeckElement";

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

	private table: Table | null = null;
	private sessionMode: TableSessionMode | null = null;

	private graph: Graph | null = null;

	private deckElement: DeckElement | null = null;

	private startScore: number = 0;
	private maxScore: number = 8;

	private sessionService: StudySessionService | null = null;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly tableService: TableService,
		private readonly graphService: GraphService,
		private readonly sessionModeService: TableSessionModeService,
		private readonly tableSessionService: TableSessionService,
		private readonly graphSessionService: GraphSessionService,
		private readonly sidebarService: SidebarService,
		private readonly topBarService: TopBarService,
		private readonly navigationService: NavigationService
	) {
		this.route.paramMap.subscribe(async params => {
			const tableId = params.get(TABLE_ID_PARAM);
			const tableSessionModeId = params.get(TABLE_SESSION_MODE_ID_PARAM);
			const graphId = params.get(GRAPH_ID_PARAM);

			if (tableId && tableSessionModeId) {
				this.table = await this.tableService.getById(tableId);
				this.deckElement = this.table;
				this.sessionMode = await this.sessionModeService.getById(tableSessionModeId);
				this.sessionService = this.tableSessionService;
			} else if (graphId) {
				this.graph = await this.graphService.getById(graphId);
				this.deckElement = this.graph;
				this.sessionService = this.graphSessionService;
			} else {
				await this.navigationService.goBack();
				return;
			}
			this.loadScores(params);

			await this.initSession();
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
			: this.deckElement!!.defaultStartingScore;
		this.maxScore = maxScoreParam ? parseInt(maxScoreParam)
			: this.deckElement!!.defaultMaxScore;
	}

	private async initSession() {
		if (this.table && this.sessionMode) {
			this.state = await this.tableSessionService.startNew(this.table, this.sessionMode,
				this.startScore, this.maxScore);
		} else if (this.graph) {
			this.state = await this.graphSessionService.startNew(this.graph,
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
		this.state = await this.sessionService.submitAnswer(
			event.value, event.field.identifier.id, this.state);

		if (this.state.lastAnswer?.correct) {
			UIkit.notification("Correct", {status: 'success',});
		} else {
			UIkit.notification("Incorrect, correct answer was:\n"
				+ this.state?.lastAnswer?.expectedAnswer, {status: 'danger'});
		}
	}

	async onForceAcceptAnswer() {
		if (!this.sessionService || !this.state) {
			return;
		}

		SessionViewComponent.clearNotifications();
		this.state = await this.sessionService.acceptLastAnswer(this.state);
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
