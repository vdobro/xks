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
import com.dobrovolskis.xks.model.UserData
import kotlinx.serialization.Serializable
import org.springframework.stereotype.Service

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.08
 */
@Service
class UserManagementService(databaseClient: CloudantClient,
                            private val userDatabaseService: UserDatabaseService) {

	private val db: Database =
			databaseClient.database("_users", false)

	fun registerUser(username: String, password: String): UserData {
		val userId = USER_PREFIX + username
		if (db.contains(userId)) {
			return db.find(UserData::class.java, userId)
		}
		db.save(UserCreationRequest(_id = userId,
				name = username,
				password = password))
		return createEntityDatabases(username)
	}

	private fun createEntityDatabases(username: String): UserData {
		val data = UserData(
				name = username,
				displayName = "",
				deckDbId = userDatabaseService.createDeckDatabase(username),
				tableDbId = userDatabaseService.createTableDatabase(username),
				tableRowDbId = userDatabaseService.createTableRowDb(username),
				tableColumnDbId = userDatabaseService.createTableColumnDb(username),
				tableSessionModeDbId = userDatabaseService.createTableSessionModeDb(username)
		)
		val existingUser = db.find(UserCreationRequest::class.java, USER_PREFIX + username)
		db.update(convertToCouchUserData(data, existingUser._rev!!))
		return data
	}

	private fun convertToCouchUserData(userData: UserData, revision: String): CouchUserData {
		return CouchUserData(
				_id = USER_PREFIX + userData.name,
				_rev = revision,
				name = userData.name,
				displayName = userData.displayName,
				deckDbId = userData.deckDbId,
				tableDbId = userData.tableDbId,
				tableRowDbId = userData.tableRowDbId,
				tableColumnDbId = userData.tableColumnDbId,
				tableSessionModeDbId = userData.tableSessionModeDbId
		)
	}

	@Serializable
	data class CouchUserData(
			val displayName: String,
			val deckDbId: String,
			val tableDbId: String,
			val tableColumnDbId: String,
			val tableRowDbId: String,
			val tableSessionModeDbId: String,

			val name: String,
			val _id: String,
			val _rev: String? = null,
			val roles: List<String> = emptyList(),
			val type: String = "user",
	)
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

private const val USER_PREFIX = "org.couchdb.user:"