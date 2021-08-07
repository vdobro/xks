/*
 * Copyright (C) 2021 Vitalijus Dobrovolskis
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

package com.dobrovolskis.xks.web.controller

import com.dobrovolskis.xks.service.PrivateDatabaseService
import org.springframework.web.bind.annotation.*
import org.springframework.web.bind.annotation.RequestMethod.DELETE
import org.springframework.web.bind.annotation.RequestMethod.POST
import java.util.*

/**
 * @author Vitalijus Dobrovolskis
 * @since 2021.06.10
 */
@RestController
@RequestMapping(value = ["/api/deck"])
class DeckController(private val privateDatabaseService: PrivateDatabaseService) {

	@RequestMapping(method = [POST], path = ["/{id}"])
	fun createDeck(
		@PathVariable id: UUID,
		@RequestBody request: UsernameRequest,
	): DeckCreatedDto {
		val name = privateDatabaseService.createDeckDatabase(
			username = request.username,
			deckId = id,
		)
		return DeckCreatedDto(database = name)
	}

	@RequestMapping(method = [DELETE], path = ["/{id}"])
	fun removeDeck(
		@PathVariable id: UUID,
		@RequestParam(required = true) username: String,
		@RequestParam(required = true) token: String,
	) {
		privateDatabaseService.removeById(username, id, token)
	}
}

data class DeckCreatedDto(
	val database: String
)

data class UsernameRequest(
	val username: String
)
