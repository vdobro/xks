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

import {DeckElement} from "@app/models/DeckElement";
import {BaseEntity} from "@app/models/BaseEntity";
import {GraphNode} from "@app/models/graph-node";
import {Table} from "@app/models/Table";
import {GraphEdge} from "@app/models/graph-edge";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.12
 */
export interface Graph extends DeckElement, BaseEntity, GraphElements {
}

export interface GraphElements {
	nodes: GraphNode[],
	edges: GraphEdge[],
}

export function isGraph(element: DeckElement | null): element is Graph {
	if (!element) {
		return false;
	}
	return (element as Table).sessionModes === undefined;
}
