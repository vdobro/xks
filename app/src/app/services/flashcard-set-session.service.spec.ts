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

import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from "@angular/common/http/testing";

import {FlashcardSetSessionService} from '@app/services/flashcard-set-session.service';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.12.04
 */
describe('FlashcardSetSessionService', () => {
	let service: FlashcardSetSessionService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		});
		service = TestBed.inject(FlashcardSetSessionService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
