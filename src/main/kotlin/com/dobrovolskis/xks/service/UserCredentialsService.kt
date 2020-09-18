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
class UserCredentialsService(persistenceConfiguration: PersistenceConfiguration) {
	private val sessionUrl = persistenceConfiguration.url + "_session"

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

}