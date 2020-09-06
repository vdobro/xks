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

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TABLE_ID_PARAM} from "../table-view/table-view.component";
import {TableService} from "../../services/table.service";
import {TableSessionModeService} from "../../services/table-session-mode.service";
import {Table} from "../../models/Table";
import {TableSessionMode} from "../../models/TableSessionMode";
import {LearningSessionState, TableSession, TableSessionService} from "../../services/table-session.service";
import {TableColumn} from "../../models/TableColumn";

export const TABLE_SESSION_ID_PARAM = "sessionId";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.19
 */
@Component({
	selector: 'app-learning-view',
	templateUrl: './learning-view.component.html',
	styleUrls: ['./learning-view.component.sass']
})
export class LearningViewComponent implements OnInit {

	table: Table;
	sessionMode: TableSessionMode;

	state: LearningSessionState<TableSession>;

	currentSideIsQuestion: boolean = true;
	answerFields: TableColumn[] = [];

	constructor(
		private readonly route: ActivatedRoute,
		private readonly tableService: TableService,
		private readonly sessionModeService: TableSessionModeService,
		private readonly sessionService: TableSessionService,
	) {
		this.route.paramMap.subscribe(async params => {
			this.table = await this.tableService.getById(params.get(TABLE_ID_PARAM));
			this.sessionMode = await this.sessionModeService.getById(params.get(TABLE_SESSION_ID_PARAM));

			await this.initSession();
		});
	}

	async ngOnInit() {
		await this.initSession();
	}

	private async initSession() {
		if (this.table && this.sessionMode) {
			this.state = await this.sessionService.startNew(this.table, this.sessionMode);
		}
	}
}
