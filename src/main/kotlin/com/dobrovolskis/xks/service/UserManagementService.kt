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
import com.dobrovolskis.xks.config.PersistenceConfiguration
import com.dobrovolskis.xks.model.UserData
import kotlinx.serialization.Serializable
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.client.RestTemplate


/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.08
 */
@Service
class UserManagementService(databaseClient: CloudantClient,
                            persistenceConfiguration: PersistenceConfiguration,
                            private val userDatabaseService: UserDatabaseService) {
	private val sessionUrl = persistenceConfiguration.url + "_session"
	private val db: Database = databaseClient.database("_users", false)

	private val usernamePattern = Regex("[a-zA-Z0-9]*")
	private val requiredUsernameLength = 5
	private val requiredPasswordLength = 8

	fun registerUser(username: String, password: String): UserData {
		validateUsername(username)
		validatePassword(password)
		require(!userExists(username)) {
			"User with given name already exists."
		}
		createUser(username = username, password = password)
		return UserData(name = username,
				tableConfiguration = userDatabaseService.createAll(username))
	}

	fun credentialsCorrect(username: String, password: String): Boolean {
		return try {
			val restTemplate = RestTemplate()
			val headers = HttpHeaders()
			headers.contentType = MediaType.APPLICATION_FORM_URLENCODED

			val map: MultiValueMap<String, String> = LinkedMultiValueMap()
			map.add("name", username)
			map.add("password", password)

			val request = HttpEntity(map, headers)
			restTemplate.postForEntity(sessionUrl, request, String::class.java)
			true
		} catch (e: Throwable) {
			false
		}
	}

	fun getExisting(username: String): UserData {
		return UserData(name = username,
				tableConfiguration = this.userDatabaseService.getAll(username))
	}

	fun forget(username: String) {
		val user = db.find(UserCreationRequest::class.java,
				USER_PREFIX + username)
		db.remove(user)
		userDatabaseService.removeAll(username)
	}

	private fun createUser(username: String, password: String) {
		db.save(UserCreationRequest(
				_id = prefixUsername(username),
				name = username,
				password = password))
	}

	private fun userExists(username: String): Boolean {
		return db.contains(prefixUsername(username))
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
	data class UserCreationRequest(
			val _id: String,
			val name: String,
			val password: String,

			val roles: List<String> = emptyList(),
			val type: String = "user",

			val _rev: String? = null,
	)
}

private const val USER_PREFIX = "org.couchdb.user:"