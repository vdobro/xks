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

package com.dobrovolskis.xks.config

import com.cloudant.client.api.ClientBuilder
import com.cloudant.client.api.CloudantClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.net.URL

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.08
 */
@Configuration
class DatabaseConnector(private val persistenceConfiguration: PersistenceConfiguration) {

	@Bean
	fun couchDbClient(): CloudantClient {
		return ClientBuilder
				.url(URL(persistenceConfiguration.url))
				.username("admin")
				.password(persistenceConfiguration.adminPassword)
				.build()
	}
}