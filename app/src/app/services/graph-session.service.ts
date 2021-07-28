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

import {Graph} from "@app/models/Graph";
import {LearningSessionState} from "./models/learning-session-state";

import {StudySessionService} from "./study-session.service";
import {ExerciseTaskService} from "./exercise-task.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.15
 */
@Injectable({
	providedIn: 'root'
})
export class GraphSessionService extends StudySessionService {

	constructor(taskService: ExerciseTaskService) {
		super(taskService);
	}

	startNew(graph: Graph,
				   startScore: number,
				   maxScore: number): LearningSessionState {
		const allTasks = this.taskService.getGraphTaskList(graph, startScore, maxScore);
		return this.createSessionFromTasks(allTasks);
	}
}
