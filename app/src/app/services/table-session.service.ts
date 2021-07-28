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

import {Injectable} from '@angular/core';

import {Table} from "@app/models/Table";
import {TableSessionMode} from "@app/models/TableSessionMode";

import {ExerciseTaskService} from "@app/services/exercise-task.service";
import {StudySessionService} from "@app/services/study-session.service";
import {LearningSessionState} from "@app/services/models/learning-session-state";
import {TableElementService} from "@app/services/table-element.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.14
 */
@Injectable({
	providedIn: 'root'
})
export class TableSessionService extends StudySessionService {

	constructor(
		taskService: ExerciseTaskService,
		private readonly cellService: TableElementService) {
		super(taskService);
	}

	startNew(table: Table,
			 sessionMode: TableSessionMode,
			 startScore: number, maxScore: number): LearningSessionState {
		const questionColumns = sessionMode.questionColumnIds
			.map(id => this.cellService.findColumn(id, table));
		const answerColumns = sessionMode.answerColumnIds
			.map(id => this.cellService.findColumn(id, table));
		const allTasks = this.taskService.getTableTaskList(table,
			questionColumns, answerColumns,
			startScore, maxScore);
		return this.createSessionFromTasks(allTasks);
	}
}
