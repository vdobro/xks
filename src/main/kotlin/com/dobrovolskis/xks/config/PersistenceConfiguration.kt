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

package com.dobrovolskis.xks.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.08
 */

const val TABLE_DECKS = "deck"
const val TABLE_ITEM_TABLES = "table"
const val TABLE_TABLE_COLUMNS = "table_column"
const val TABLE_TABLE_ROWS = "table_row"
const val TABLE_SESSION_MODES = "table_session_mode"
const val TABLE_GRAPHS = "graph"
const val TABLE_GRAPH_NODES = "graph-node"
const val TABLE_GRAPH_EDGES = "graph-edges"

@Component
@ConfigurationProperties(prefix = "db")
data class PersistenceConfiguration(
		var adminPassword: String = "",
		var url: String = ""
)