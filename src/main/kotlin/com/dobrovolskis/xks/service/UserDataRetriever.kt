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
import com.dobrovolskis.xks.model.UserTableConfiguration
import kotlinx.serialization.Serializable
import org.springframework.stereotype.Service

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.17
 */
@Service
class UserDataRetriever(databaseClient: CloudantClient,
                        private val userDatabaseService: UserDatabaseService) {
	private val usersDb: Database = databaseClient.database("_users", false)

	private val usernamePattern = Regex("[a-zA-Z0-9]*")
	private val requiredUsernameLength = 5
	private val requiredPasswordLength = 8

	fun createUser(username: String, password: String) {
		validateUsername(username)
		validatePassword(password)
		require(!userExists(username)) {
			"User with given name already exists."
		}
		usersDb.save(CreationRequest(
				_id = prefixUsername(username),
				name = username,
				roles = emptyList(),
				password = password))
		usersDb.ensureFullCommit()
		val newUser = getUser(username)
		usersDb.update(newUser.copy(tableConfig = userDatabaseService.createAll(username)))
	}

	fun getUserTableConfiguration(username: String): UserTableConfiguration {
		val user = usersDb.find(FullUser::class.java, prefixUsername(username))
		return user.tableConfig!!
	}

	fun removeUser(username: String) {
		val user = getUser(username)
		usersDb.remove(user)

		try {
			userDatabaseService.removeAll(user.tableConfig!!)
		} catch (_: Throwable) {
			//User could be deleted, but their database information could not - this is tolerable
		}
	}

	private fun getUser(username: String): FullUser {
		require(userExists(username)) {
			"User not found"
		}
		return usersDb.find(FullUser::class.java, prefixUsername(username))
	}

	private fun userExists(username: String): Boolean {
		return usersDb.contains(prefixUsername(username))
	}

	private fun validateUsername(username: String) {
		require(usernamePattern.matches(username)) {
			"Username can only contain letters and numbers"
		}
		require(username.length >= requiredUsernameLength) {
			"Username must be at least 5 characters long"
		}
	}

	private fun validatePassword(password: String) {
		require(password.length >= requiredPasswordLength) {
			"Password must be at least $requiredPasswordLength characters long"
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

			val tableConfig: UserTableConfiguration?
	)
}

private const val USER_PREFIX = "org.couchdb.user:"
