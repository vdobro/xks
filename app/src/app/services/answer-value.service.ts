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

import {v4 as uuid} from 'uuid';
import {Injectable} from '@angular/core';
import {AnswerValueRepository} from "../repositories/answer-value-repository.service";
import {AnswerValue} from "../models/AnswerValue";
import {GraphNode} from "../models/GraphNode";
import {TableRow} from "../models/TableRow";
import {TableColumn} from "../models/TableColumn";
import {TableRowRepository} from "../repositories/table-row-repository.service";
import {Flashcard} from "../models/Flashcard";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.10.20
 */
@Injectable({
	providedIn: 'root'
})
export class AnswerValueService {

	constructor(private readonly repository: AnswerValueRepository,
				private readonly rowRepository : TableRowRepository) {
	}

	async getForNode(node: GraphNode) : Promise<AnswerValue> {
		return await this.getExisting(node.valueId);
	}

	async getForCell(row: TableRow, column: TableColumn) : Promise<AnswerValue> {
		const existingRow = await this.rowRepository.getById(row.id);
		const id = existingRow.valueIds.get(column.id)!!;
		return await this.getExisting(id);
	}

	async getForFlashcard(flashcard: Flashcard) : Promise<AnswerValue> {
		return await this.getExisting(flashcard.answerId);
	}

	async create(value: string) : Promise<AnswerValue> {
		const entity = {
			defaultValue: value,
			alternatives: [],
			id: uuid(),
		}
		await this.repository.add(entity);
		return this.getExisting(entity.id);
	}

	async setDefault(value: string, answer: AnswerValue) : Promise<AnswerValue> {
		const existing = await this.getExisting(answer.id);
		existing.defaultValue = value;
		await this.repository.update(existing);
		return existing;
	}

	async delete(id: string) : Promise<void> {
		await this.repository.delete(id);
	}

	async setAlternatives(value: string[], answer: AnswerValue) : Promise<AnswerValue> {
		const existing = await this.getExisting(answer.id);
		existing.alternatives = value;
		await this.repository.update(existing);
		return existing;
	}

	private async getExisting(id: string) : Promise<AnswerValue> {
		return await this.repository.getById(id);
	}
}
