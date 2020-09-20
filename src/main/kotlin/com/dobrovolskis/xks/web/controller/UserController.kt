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

package com.dobrovolskis.xks.web.controller

import com.dobrovolskis.xks.service.UserCredentialsService
import com.dobrovolskis.xks.service.UserDataRetriever
import com.dobrovolskis.xks.web.model.UserCredentialsDto
import org.springframework.http.HttpStatus.OK
import org.springframework.http.HttpStatus.UNAUTHORIZED
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod.POST
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.08
 */
@RestController
@RequestMapping(value = ["/api/user"])
class UserController(private val userDataRetriever: UserDataRetriever,
                     private val userCredentialsService: UserCredentialsService) {

	@RequestMapping(value = ["/register"], method = [POST])
	@ResponseBody
	fun createUser(@RequestBody dto: UserCredentialsDto) {
		return userDataRetriever.createUser(
				username = dto.name,
				password = dto.password)
	}

	@RequestMapping(value = ["/forget"], method = [POST])
	fun forgetUser(@RequestBody dto: UserCredentialsDto): ResponseEntity<Void> {
		return if (!userCredentialsService.credentialsCorrect(
						username = dto.name,
						password = dto.password)) {
			ResponseEntity(UNAUTHORIZED)
		} else {
			userDataRetriever.removeUser(dto.name)
			ResponseEntity(OK)
		}
	}
}

