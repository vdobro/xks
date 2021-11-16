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

import {IdEntity} from "@app/repositories/id-entity";
import {ElementId} from "@app/models/element-id";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.10.11
 */
export interface DeckElement extends IdEntity {
	deckId: string,
	name: string,
	defaultStartingScore: number,
	defaultMaxScore: number,
}

export type DeckElementType = "graph" | "table" | "flashcards";

export const getId = (element: DeckElement): ElementId => {
	return {element: element.id, deck: element.deckId}
}
