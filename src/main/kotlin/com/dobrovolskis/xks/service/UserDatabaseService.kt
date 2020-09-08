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
import com.dobrovolskis.xks.config.*
import kotlinx.serialization.Serializable
import org.springframework.stereotype.Service

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.08
 */
@Service
class UserDatabaseService(private val client: CloudantClient) {

	private val userTables: Database =
			client.database("user_entity_tables", false)

	init {
		try {
			client.createDB("user_entity_tables")
		} catch (_: Throwable) {
		}
	}

	fun createAll(username: String): UserTableConfiguration {
		val configuration = UserTableConfiguration(
				decks = createWithPermission(username, TABLE_DECKS),
				tables = createWithPermission(username, TABLE_ITEM_TABLES),
				tableColumns = createWithPermission(username, TABLE_TABLE_COLUMNS),
				tableRows = createWithPermission(username, TABLE_TABLE_ROWS),
				tableSessionModes = createWithPermission(username, TABLE_SESSION_MODES),
				_id = username
		)
		userTables.save(configuration)
		return configuration
	}

	fun removeAll(username: String) {
		val configuration = userTables.find(UserTableConfiguration::class.java, username)
		userTables.remove(configuration)

		client.deleteDB(configuration.tableSessionModes)
		client.deleteDB(configuration.tableRows)
		client.deleteDB(configuration.tableColumns)
		client.deleteDB(configuration.tables)
		client.deleteDB(configuration.decks)
	}

	private fun createWithPermission(username: String, dbName: String): String {
		val name = username + dbName
		try {
			client.deleteDB(name)
		} catch (_: Throwable) {
		}
		val database = client.database(name, true)
		database.save(UserDbSecurityConfiguration(
				admins = MemberConfiguration(),
				members = MemberConfiguration(names = listOf(username))
		))
		return name
	}
}

@Serializable
data class UserTableConfiguration(
		val decks: String,
		val tables: String,
		val tableColumns: String,
		val tableRows: String,
		val tableSessionModes: String,

		val _id: String,
		val _rev: String? = null,
)

@Serializable
data class UserDbSecurityConfiguration(
		val admins: MemberConfiguration,
		val members: MemberConfiguration,

		val _id: String = "_security",
		val _rev: String? = null,
)

@Serializable
data class MemberConfiguration(
		val names: List<String> = emptyList(),
		val roles: List<String> = emptyList()
)