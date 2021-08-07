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

import com.dobrovolskis.xks.service.PrivateDatabaseService
import com.dobrovolskis.xks.service.UserService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

/**
 * @author Vitalijus Dobrovolskis
 * @since 2021.06.10
 */
@Service
class RemoveUser(
	private val userService: UserService,
	private val privateDatabaseService: PrivateDatabaseService
) {
	private val logger = LoggerFactory.getLogger(RemoveUser::class.java)

	operator fun invoke(username: String) {
		userService.removeUser(username)

		try {
			privateDatabaseService.removeAll(username)
		} catch (_: Throwable) {
			logger.warn("Could not delete decks for user $username")
		}
	}
}
