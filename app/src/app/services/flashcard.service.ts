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
import {Subject, Subscribable} from "rxjs";
import {FlashcardSet} from "../models/FlashcardSet";
import {Flashcard} from "../models/Flashcard";
import {FlashcardRepository} from "../repositories/flashcard-repository.service";
import {AnswerValueService} from "./answer-value.service";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.11.21
 */
@Injectable({
	providedIn: 'root'
})
export class FlashcardService {

	private readonly _countChangedForList = new Subject<FlashcardSet>();

	readonly cardCountChanged: Subscribable<FlashcardSet> = this._countChangedForList;

	constructor(private readonly repository: FlashcardRepository,
				private readonly answerValueService: AnswerValueService) {
	}

	async getBySet(set: FlashcardSet): Promise<Flashcard[]> {
		return await this.repository.getAllInSet(set.id);
	}

	async create(question: string, answer: string, set: FlashcardSet) : Promise<Flashcard> {
		const answerValue = await this.answerValueService.create(answer);
		const card : Flashcard = {
			id: uuid(),
			setId: set.id,
			question: question,
			answerId: answerValue.id,
		};
		await this.repository.add(card);
		return card;
	}

	async delete(card: Flashcard) {
		await this.repository.delete(card.id);
	}

	async update(card: Flashcard, question: string, answer: string) {
		const existing = await this.repository.getById(card.id);
		existing.question = question;
		const answerValue = await this.answerValueService.getForFlashcard(existing);
		await this.answerValueService.setDefault(answer, answerValue);
	}

	async anyCardsExist(cardSet: FlashcardSet) : Promise<boolean> {
		return await this.repository.anyCardsExist(cardSet);
	}
}
