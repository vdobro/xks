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

import com.dobrovolskis.xks.config.PersistenceConfiguration
import com.dobrovolskis.xks.web.CredentialsError
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.08
 */
@Service
class UserCredentialsService(persistenceConfiguration: PersistenceConfiguration) {
	private val sessionUrl = persistenceConfiguration.url + "_session"

	fun getCurrentUser(cookie: String): String {
		try {
			val restTemplate = RestTemplate()
			val headers = HttpHeaders()
			headers.contentType = MediaType.APPLICATION_FORM_URLENCODED
			headers.add("Cookie", "AuthSession=${cookie}")

			val request = HttpEntity(null, headers)
			val response = restTemplate.exchange(sessionUrl, HttpMethod.GET, request, SessionResponse::class.java)
			val body = response.body!!
			require(body.ok)
			return body.userCtx.name
		} catch (e: Throwable) {
			throw CredentialsError()
		}
	}
}

private data class SessionResponse(
	val ok: Boolean,
	val userCtx: SessionUserInfo,
)

private data class SessionUserInfo(
	val name: String,
	val roles: List<String>,
)
