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

import {Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TABLE_ID_PARAM} from "../table-view/table-view.component";
import {TableService} from "../../services/table.service";
import {TableSessionModeService} from "../../services/table-session-mode.service";
import {Table} from "../../models/Table";
import {TableSessionMode} from "../../models/TableSessionMode";
import {TableSessionService} from "../../services/table-session.service";
import {TableColumn} from "../../models/TableColumn";
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

export const TABLE_SESSION_MODE_ID_PARAM = "sessionModeId";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.19
 */
@Component({
	selector: 'app-session-view',
	templateUrl: './session-view.component.html',
	styleUrls: ['./session-view.component.sass']
})
export class SessionViewComponent implements OnInit, OnDestroy, OnChanges {

	state: LearningSessionState = null;
	answerFields: TableColumn[] = [];

	private table: Table;
	private sessionMode: TableSessionMode;

	graph: Graph;

	private sessionService: StudySessionService = null;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly tableService: TableService,
		private readonly graphService: GraphService,
		private readonly sessionModeService: TableSessionModeService,
		private readonly tableSessionService: TableSessionService,
		private readonly graphSessionService: GraphSessionService,
		private readonly sidebarService: SidebarService,
		private readonly topBarService: TopBarService,
	) {
		this.route.paramMap.subscribe(async params => {
			const tableId = params.get(TABLE_ID_PARAM);
			const tableSessionModeId = params.get(TABLE_SESSION_MODE_ID_PARAM);
			const graphId = params.get(GRAPH_ID_PARAM);
			if (tableId && tableSessionModeId) {
				this.table = await this.tableService.getById(tableId);
				this.sessionMode = await this.sessionModeService.getById(tableSessionModeId);
				this.sessionService = this.tableSessionService;
			} else if (graphId) {
				this.graph = await this.graphService.getById(graphId);
				this.sessionService = this.graphSessionService;
			}
			await this.initSession();
		});
	}

	async ngOnInit() {
	}

	async ngOnChanges() {

	}

	ngOnDestroy() {
		this.topBarService.clearItems();
		this.tableSessionService.cleanup();
		this.graphSessionService.cleanup();
	}

	private async initSession() {
		if (this.table && this.sessionMode) {
			this.state = await this.tableSessionService.startNew(this.table, this.sessionMode);
		} else if (this.graph) {
			this.state = await this.graphSessionService.startNew(this.graph);
		}

		this.sidebarService.hide();
		this.topBarService.clearItems();
		this.topBarService.addItem(new NavBarItem(SessionNavigationComponent));
	}

	async onAnswer(event: { value: string, field: FlashcardField }) {
		UIkit.notification.closeAll();
		this.state = await this.sessionService
			.submitAnswer(event.value, event.field.identifier.id, this.state);

		if (this.state.lastAnswer.correct) {
			UIkit.notification("Correct", {status: 'success',});
		} else {
			UIkit.notification("Incorrect, correct answer was:\n"
				+ this.state?.lastAnswer?.expectedAnswer, {status: 'danger'});
		}
	}

	async onForceAcceptAnswer() {
		UIkit.notification.closeAll();
		this.state = await this.sessionService.acceptLastAnswer(this.state);
		UIkit.notification("Answer accepted", {
			status: 'warning',
			timeout: 1000,
		});
	}
}
