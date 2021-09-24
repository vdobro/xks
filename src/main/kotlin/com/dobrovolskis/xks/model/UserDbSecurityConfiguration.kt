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

import kotlinx.serialization.Serializable

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.08
 */
@Serializable
data class UserDbSecurityConfiguration(
		val admins: MemberConfiguration,
		val members: MemberConfiguration,

		val _id: String = SEC_ID,
		val _rev: String? = null,
)

const val SEC_ID = "_security"
