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

import com.cloudant.http.HttpConnection
import com.dobrovolskis.xks.config.ApplicationConfiguration
import com.dobrovolskis.xks.config.DatabaseConnector
import com.dobrovolskis.xks.config.PersistenceConfiguration
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.ApplicationListener
import org.springframework.context.event.EventListener
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import java.net.URL


/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.19
 */
@Component
class DatabaseSetupService(
		private val applicationConfiguration: ApplicationConfiguration,
		private val persistenceConfiguration: PersistenceConfiguration,
		databaseConnector: DatabaseConnector) : ApplicationListener<ApplicationReadyEvent> {
	private val client = databaseConnector.adminClient()

	@EventListener
	override fun onApplicationEvent(event: ApplicationReadyEvent) {
		fixUsersTablePermission()
	}

	fun fixUsersTablePermission() {
		client.database(USERS_DB, true)
		client.database(REPLICATOR_DB, true)

		configure(USERS_SECURITY_EDITABLE, TRUE)
		request(USERS_SECURITY, "{}")

		val origins = arrayOf(
				"http://localhost:4200",
				"http://localhost:8080",
				"https://${applicationConfiguration.host}").joinToString()
		configure(CORS_ORIGINS, origins)
		configure(ENABLE_CORS, TRUE)
		configure(SAME_SITE, "strict")
	}

	private fun configure(setting: String, value: String) {
		request(CONFIG_PREFIX + setting, "\"$value\"")
	}

	private fun request(path: String, body: String) {
		val connection = HttpConnection(HttpMethod.PUT.name,
				resolveAndFormatUrl(path),
				MediaType.APPLICATION_JSON_VALUE)
		connection.setRequestBody(body)
		client.executeRequest(connection)
	}

	private fun resolveAndFormatUrl(path: String): URL {
		val base = persistenceConfiguration.url
		val slash = "/"
		val separator = if (!base.endsWith(slash)) slash else ""

		return URL(base + separator + path)
	}
}

private const val TRUE = true.toString()
private const val FALSE = false.toString()

private const val REPLICATOR_DB = "_replicator"
private const val USERS_DB = "_users"
private const val USERS_SECURITY = "$USERS_DB/_security"
private const val CONFIG_PREFIX = "_node/_local/_config"

private const val BASE = "/couchdb"
private const val USERS_SECURITY_EDITABLE = "$BASE/users_db_security_editable"

private const val HTTPD = "/httpd"
private const val ENABLE_CORS = "$HTTPD/enable_cors"

private const val CORS = "/cors"
private const val CORS_ORIGINS = "$CORS/origins"

private const val HTTPD_AUTH = "/couch_httpd_auth"
private const val SAME_SITE = "$HTTPD_AUTH/same_site"