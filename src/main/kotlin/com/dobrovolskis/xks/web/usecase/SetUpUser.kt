/*
 * Copyright (C) 2021 Vitalijus Dobrovolskis
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

package com.dobrovolskis.xks.web.usecase

import com.dobrovolskis.xks.model.User
import com.dobrovolskis.xks.service.PrivateDatabaseService
import com.dobrovolskis.xks.service.UserService
import org.springframework.stereotype.Service

/**
 * @author Vitalijus Dobrovolskis
 * @since 2021.06.10
 */
@Service
class SetUpUser(
	private val userService: UserService,
	private val privateDatabaseService: PrivateDatabaseService
) {
	operator fun invoke(username: String, password: String): User {
		val user = userService.createUser(username, password)
		val database = privateDatabaseService.getPrivateDatabaseName(username)
		return toPublicUser(user, database)
	}

	private fun toPublicUser(
		user: UserService.FullUser,
		privateDatabase: String
	): User {
		return User(username = user.name, database = privateDatabase)
	}
}
