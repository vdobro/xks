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

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.10
 */
@ControllerAdvice
class ApiRestExceptionHandler : ResponseEntityExceptionHandler() {

	@ExceptionHandler(IllegalArgumentException::class)
	protected fun handleException(e: IllegalArgumentException, request: WebRequest): ResponseEntity<Any> {
		val msg = ValidationResponse(e.message ?: "Unknown error")
		return handleExceptionInternal(e as Exception, msg, headers(), HttpStatus.BAD_REQUEST, request)
	}
}

@ControllerAdvice
class CredentialExceptionHandler : ResponseEntityExceptionHandler() {

	@ExceptionHandler(IllegalStateException::class)
	protected fun handleException(e: IllegalStateException, request: WebRequest): ResponseEntity<Any> {
		val msg = ValidationResponse(e.message ?: "Unknown error")
		return handleExceptionInternal(e as Exception, msg, headers(), HttpStatus.UNAUTHORIZED, request)
	}
}

private fun headers(): HttpHeaders {
	val headers = HttpHeaders()
	headers.contentType = MediaType.APPLICATION_JSON
	return headers
}

data class ValidationResponse(
		val error: String,
)