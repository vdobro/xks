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
import {DeckElement} from "../models/DeckElement";
import {Table} from "../models/Table";
import {TableRepository} from "../repositories/table-repository.service";
import {GraphRepository} from "../repositories/graph-repository.service";
import {Graph} from "../models/Graph";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.10.11
 */
@Injectable({
	providedIn: 'root'
})
export class DeckElementService {

	constructor(private readonly tableRepository: TableRepository,
				private readonly graphRepository: GraphRepository) {
	}

	async setDefaultStartingScore(deckElement: DeckElement, startingScore: number): Promise<void> {
		await this.updateElement(deckElement, (x: DeckElement) => {
			x.defaultStartingScore = startingScore;
		});
	}

	async setDefaultMaximumScore(deckElement: DeckElement, startingScore: number): Promise<void> {
		await this.updateElement(deckElement, (x: DeckElement) => {
			x.defaultMaxScore = startingScore;
		});
	}

	private async updateElement(element: DeckElement,
								updateOperation: (x: DeckElement) => void): Promise<void> {
		if (DeckElementService.isTable(element)) {
			await this.updateTable(element, updateOperation);
		} else if (DeckElementService.isGraph(element)) {
			await this.updateGraph(element, updateOperation);
		}
	}

	private async updateTable(table: Table, operation: (table: Table) => void): Promise<void> {
		const existing = await this.tableRepository.getById(table.id);
		operation(existing);
		await this.tableRepository.update(existing);
	}

	private async updateGraph(graph: Graph, operation: (graph: Graph) => void): Promise<void> {
		const existing = await this.graphRepository.getById(graph.id);
		operation(existing);
		await this.graphRepository.update(existing);
	}

	private static isTable(element: DeckElement | null): element is Table {
		return element !== null && (element as Table).sessionModeIds !== undefined;
	}

	private static isGraph(element: DeckElement | null): element is Graph {
		return element !== null;
	}
}
