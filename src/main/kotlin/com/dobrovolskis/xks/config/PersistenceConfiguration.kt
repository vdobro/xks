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

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.08
 */

const val ID_COLUMN_NAME = "id"
private const val TABLE_NAME_PREFIX = "xks_"

const val TABLE_DECKS = "${TABLE_NAME_PREFIX}deck"
const val TABLE_ITEM_TABLES = "${TABLE_NAME_PREFIX}table"
const val TABLE_TABLE_COLUMNS = "${TABLE_NAME_PREFIX}table_column"
const val TABLE_TABLE_ROWS = "${TABLE_NAME_PREFIX}table_row"
const val TABLE_TABLE_ROWS_COLUMNS = "${TABLE_NAME_PREFIX}table_row_column"
const val TABLE_TABLE_CELLS = "${TABLE_NAME_PREFIX}table_cell"