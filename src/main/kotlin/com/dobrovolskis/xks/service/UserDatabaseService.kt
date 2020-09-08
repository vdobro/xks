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
import com.dobrovolskis.xks.config.*
import kotlinx.serialization.Serializable
import org.springframework.stereotype.Service

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.08
 */
@Service
class UserDatabaseService(private val client: CloudantClient) {

	fun createDeckDatabase(username: String): String {
		return createWithPermission(username, TABLE_DECKS)
	}

	fun createTableDatabase(username: String): String {
		return createWithPermission(username, TABLE_ITEM_TABLES)
	}

	fun createTableRowDb(username: String): String {
		return createWithPermission(username, TABLE_TABLE_ROWS)
	}

	fun createTableColumnDb(username: String): String {
		return createWithPermission(username, TABLE_TABLE_COLUMNS)
	}

	fun createTableSessionModeDb(username: String): String {
		return createWithPermission(username, TABLE_SESSION_MODES)
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
data class UserDbSecurityConfiguration(
		val admins: MemberConfiguration,
		val members: MemberConfiguration,

		val _id: String = "security",
		val _rev: String? = null,
)

@Serializable
data class MemberConfiguration(
		val names: List<String> = emptyList(),
		val roles: List<String> = emptyList()
)