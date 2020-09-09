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

import com.dobrovolskis.xks.model.UserData
import com.dobrovolskis.xks.service.UserManagementService
import com.dobrovolskis.xks.web.model.UserCredentialsDto
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatus.OK
import org.springframework.http.HttpStatus.UNAUTHORIZED
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.bind.annotation.RequestMethod.POST

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.08
 */
@RestController
@RequestMapping(value = ["/api"])
class UserController(private val userManagementService: UserManagementService) {

	@RequestMapping(value = ["/register"], method = [POST])
	@ResponseBody
	fun createUser(@RequestBody dto: UserCredentialsDto): UserData {
		return userManagementService.registerUser(
				username = dto.username,
				password = dto.password)
	}

	@RequestMapping(value = ["/login"], method = [POST])
	fun getUserDetails(@RequestBody dto: UserCredentialsDto): ResponseEntity<UserData> {
		if (!userManagementService.credentialsCorrect(
						username = dto.username,
						password = dto.password)) {
			return ResponseEntity(UNAUTHORIZED)
		}
		return ResponseEntity.ok(userManagementService.getExisting(dto.username))
	}

	@RequestMapping(value = ["/forget"], method = [POST])
	fun forgetUser(@RequestBody dto: UserCredentialsDto): ResponseEntity<Void> {
		return if (!userManagementService.credentialsCorrect(
						username = dto.username,
						password = dto.password)) {
			ResponseEntity(UNAUTHORIZED)
		} else {
			userManagementService.forget(dto.username)
			ResponseEntity(OK)
		}
	}

	@ExceptionHandler(IllegalArgumentException::class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ResponseBody
	fun handleException(exception: IllegalArgumentException): ValidationResponse {
		return ValidationResponse(exception.message ?: "Unknown error")
	}

	data class ValidationResponse(
			val error: String,
	)
}

