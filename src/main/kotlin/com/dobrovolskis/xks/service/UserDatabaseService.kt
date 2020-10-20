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
import com.dobrovolskis.xks.config.PersistenceConfiguration
import com.dobrovolskis.xks.model.MemberConfiguration
import com.dobrovolskis.xks.model.UserDbSecurityConfiguration
import com.dobrovolskis.xks.model.UserTableConfiguration
import org.springframework.stereotype.Service
import java.util.*

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.08
 */
@Service
class UserDatabaseService(
		private val dbConfig: PersistenceConfiguration,
		private val client: CloudantClient) {

	fun createAll(username: String): UserTableConfiguration {
		return UserTableConfiguration(
				decks = createWithPermission(username),
				tables = createWithPermission(username),
				tableColumns = createWithPermission(username),
				tableRows = createWithPermission(username),
				tableSessionModes = createWithPermission(username),
				graphs = createWithPermission(username),
				graphNodes = createWithPermission(username),
				graphEdges = createWithPermission(username),
				answerValues = createWithPermission(username),
		)
	}

	fun removeAll(configuration: UserTableConfiguration) {
		client.deleteDB(configuration.graphEdges)
		client.deleteDB(configuration.graphNodes)
		client.deleteDB(configuration.graphs)
		client.deleteDB(configuration.tableSessionModes)
		client.deleteDB(configuration.tableRows)
		client.deleteDB(configuration.tableColumns)
		client.deleteDB(configuration.tables)
		client.deleteDB(configuration.decks)
		client.deleteDB(configuration.answerValues)
	}

	private fun createWithPermission(username: String): String {
		val name = "xks_${UUID.randomUUID()}"
		try {
			client.deleteDB(name)
		} catch (_: Throwable) {
			//Database didn't exist, so no problem
		}
		val database = client.database(name, true)
		database.save(UserDbSecurityConfiguration(
				admins = MemberConfiguration(names = listOf(dbConfig.username)),
				members = MemberConfiguration(names = listOf(username))
		))
		return name
	}
}
