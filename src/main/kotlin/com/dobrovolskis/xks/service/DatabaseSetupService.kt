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
import com.dobrovolskis.xks.config.PROFILE_DEVELOPMENT
import com.dobrovolskis.xks.config.PersistenceConfiguration
import org.slf4j.LoggerFactory
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.ApplicationListener
import org.springframework.context.event.EventListener
import org.springframework.core.env.Environment
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import java.net.URL

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.19
 */
@Service
class DatabaseSetupService(
	environment: Environment,
	private val applicationConfiguration: ApplicationConfiguration,
	private val persistenceConfiguration: PersistenceConfiguration,
	databaseConnector: DatabaseConnector
) : ApplicationListener<ApplicationReadyEvent> {

	private val logger = LoggerFactory.getLogger(DatabaseSetupService::class.java)

	private val client = databaseConnector.adminClient()
	private val developmentProfileActive = environment.activeProfiles.contains(PROFILE_DEVELOPMENT)

	@EventListener
	override fun onApplicationEvent(event: ApplicationReadyEvent) {
		fixUsersTablePermission()
	}

	fun fixUsersTablePermission() {
		logger.debug("Fixing users table permission")
		client.database(USERS_DB, true)
		client.database(REPLICATOR_DB, true)

		pushSettings()
		logger.debug("Done fixing users table permission")
	}

	fun request(path: String, body: String) {
		val connection = HttpConnection(
			HttpMethod.PUT.name(),
			resolveAndFormatUrl(path),
			MediaType.APPLICATION_JSON_VALUE
		)
		connection.setRequestBody(body)
		client.executeRequest(connection)

		val verificationConnection = HttpConnection(
			HttpMethod.GET.name(),
			resolveAndFormatUrl(path),
			MediaType.APPLICATION_JSON_VALUE
		)
		client.executeRequest(verificationConnection)
		val verificationResponse = verificationConnection.responseAsString()
		require(verificationResponse.replace("\n", "") == body) {
			"Could not set database setting"
		}
	}

	private fun pushSettings() {
		configure(BaseSettings.UsersSecurityEditable, TRUE)
		request(UsersDb.Security.value, "{}")

		configure(HttpdSettings.EnableCors, TRUE)
		if (developmentProfileActive) {
			logger.debug("Development profile is active, setting up CORS")
			configure(CorsSettings.Credentials, TRUE)
		}
		configure(CorsSettings.Origins, getCorsOrigins())

		configure(HttpdAuthSettings.SameSite, "strict")
		configure(ChttpdAuth.AllowPersistentCookies, TRUE)
		configure(ChttpdAuth.SessionTimeout, 604800.toString())

		configure(CouchPerUser.Enable, TRUE)
		configure(CouchPerUser.AutomaticallyDeleteUserDatabase, TRUE)
	}

	private fun configure(setting: SettingsCollection, value: String) {
		configure(setting.value, value)
	}

	private fun configure(setting: String, value: String) {
		request(CONFIG_PREFIX + setting, "\"$value\"")
	}

	private fun resolveAndFormatUrl(path: String): URL {
		val base = persistenceConfiguration.url
		val slash = "/"
		val separator = if (!base.endsWith(slash)) slash else ""

		return URL(base + separator + path)
	}

	private fun getCorsOrigins(): String {
		return if (developmentProfileActive)
			"http://localhost:4200, http://localhost:9091"
		else {
			"https://${applicationConfiguration.host}"
		}
	}
}

private const val TRUE = true.toString()
private const val FALSE = false.toString()

private interface SettingsCollection {
	val value: String
}

private const val CONFIG_PREFIX = "_node/_local/_config"
private const val BASE = "/couchdb"
private enum class BaseSettings(override val value: String): SettingsCollection {
	UsersSecurityEditable("${BASE}/users_db_security_editable")
}

const val USERS_DB = "_users"
private const val REPLICATOR_DB = "_replicator"
private enum class UsersDb(override val value: String): SettingsCollection {
	Security("${USERS_DB}/_security")
}

private const val CHTTPD = "/chttpd"
private enum class HttpdSettings(override val value: String): SettingsCollection {
	EnableCors("$CHTTPD/enable_cors")
}

private const val CORS = "/cors"
private enum class CorsSettings(override val value: String): SettingsCollection {
	Origins("${CORS}/origins"),
	Credentials("${CORS}/credentials")
}

private const val HTTPD_AUTH = "/couch_httpd_auth"
private enum class HttpdAuthSettings(override val value: String): SettingsCollection {
	SameSite("$HTTPD_AUTH/same_site")
}

private const val CHTTPD_AUTH = "/chttpd_auth"
private enum class ChttpdAuth(override val value: String) : SettingsCollection {
	AllowPersistentCookies("${CHTTPD_AUTH}/allow_persistent_cookies"),
	SessionTimeout("${CHTTPD_AUTH}/timeout")
}

private const val COUCH_PERUSER = "/couch_peruser"
private enum class CouchPerUser(override val value: String) : SettingsCollection {
	Enable("${COUCH_PERUSER}/enable"),
	AutomaticallyDeleteUserDatabase("${COUCH_PERUSER}/delete_dbs")
}

private const val SESSION_TIMEOUT = "$CHTTPD_AUTH/timeout"
