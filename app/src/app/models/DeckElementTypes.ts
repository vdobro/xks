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

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.11.21
 */
import {DeckElement} from "./DeckElement";
import {Table} from "./Table";
import {Graph} from "./Graph";

export enum DeckElementTypes {
	Table= "table",
	Graph = "graph",
	SimpleCards = "simple_cards"
}

export class ElementTypeUtilities {

	public static isTable(element: DeckElement | null): element is Table {
		return element !== null && element.type === DeckElementTypes.Table;
	}

	public static isGraph(element: DeckElement | null): element is Graph {
		return element !== null &&  element.type === DeckElementTypes.Graph;
	}

	public static isSimpleCardList(element: DeckElement | null): element is Graph {
		return element !== null && element.type === DeckElementTypes.SimpleCards;
	}
}
