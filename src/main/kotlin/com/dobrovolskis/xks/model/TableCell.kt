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

package com.dobrovolskis.xks.model

import com.dobrovolskis.xks.config.ID_COLUMN_NAME
import com.dobrovolskis.xks.config.TABLE_TABLE_CELLS
import org.springframework.lang.NonNull
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.04.08
 */
@Entity
@Table(name = TABLE_TABLE_CELLS)
data class TableCell(
		@NonNull @Column(name = "value")
		var value: String,

		@Id @Column(name = ID_COLUMN_NAME, updatable = false)
		var id: UUID? = null
)