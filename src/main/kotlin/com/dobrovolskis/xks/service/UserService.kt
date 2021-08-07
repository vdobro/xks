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

package com.dobrovolskis.xks.service

import com.cloudant.client.api.CloudantClient
import com.cloudant.client.api.Database
import kotlinx.serialization.Serializable
import org.springframework.stereotype.Service

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.17
 */
@Service
class UserService(
	databaseClient: CloudantClient,
	private val privateDatabaseService: PrivateDatabaseService
) {

	private val usersDb: Database = databaseClient.database(USER_DATABASE, false)

	private val usernamePattern = Regex("^[a-zA-Z]+[a-zA-Z0-9]{${MINIMUM_USERNAME_LENGTH - 1},}\$")

	fun createUser(username: String, password: String): FullUser {
		validateUsername(username, password)
		validatePassword(password)
		require(!userExists(username)) {
			"Username not available."
		}
		usersDb.save(
			CreationRequest(
				_id = prefixUsername(username),
				name = username,
				roles = emptyList(),
				password = password
			)
		)
		usersDb.ensureFullCommit()
		privateDatabaseService.createTypeIndex(username)
		return getUser(username)
	}

	fun removeUser(username: String) {
		val user = getUser(username)
		usersDb.remove(user)
		usersDb.ensureFullCommit()
	}

	fun getUser(username: String): FullUser {
		require(userExists(username)) {
			"User not found"
		}
		return usersDb.find(FullUser::class.java, prefixUsername(username))
	}

	private fun userExists(username: String): Boolean {
		return usersDb.contains(prefixUsername(username))
	}

	private fun validateUsername(username: String, password: String) {
		require(usernamePattern.matches(username)) {
			"Username can only contain Latin letters and digits, " +
					"must begin with a letter and has to be at least 3 characters long."
		}
		require(!password.contains(username)) {
			"Username may not be included in the password."
		}
	}

	private fun validatePassword(password: String) {
		require(password.length >= MINIMUM_PASSWORD_LENGTH) {
			"Password must be at least $MINIMUM_PASSWORD_LENGTH characters long."
		}
	}

	private fun prefixUsername(username: String): String {
		return USER_PREFIX + username
	}

	@Serializable
	data class CreationRequest(
		val _id: String,
		val name: String,
		val password: String,
		val roles: List<String> = emptyList(),
		val type: String = "user"
	)

	@Serializable
	data class FullUser(
		val _id: String,
		val _rev: String? = null,
		val name: String,
		val roles: List<String>,

		val type: String? = null,
		val password_scheme: String? = null,
		val iterations: Int? = null,
		val derived_key: String? = null,
		val salt: String? = null,
	)
}

private const val USER_PREFIX = "org.couchdb.user:"
private const val USER_DATABASE = USERS_DB

private const val MINIMUM_USERNAME_LENGTH = 3
private const val MINIMUM_PASSWORD_LENGTH = 8
