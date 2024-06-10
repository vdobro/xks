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

import {TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {FlashcardSetService} from '@app/services/flashcard-set.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {
	ConfirmDeleteTableColumnModalComponent
} from "@app/components/confirm-delete-table-column-modal/confirm-delete-table-column-modal.component";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2021.11.15
 */
describe('FlashcardSetService', () => {
	let service: FlashcardSetService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				FormsModule,
				ReactiveFormsModule,
			],
			declarations: [
				ConfirmDeleteTableColumnModalComponent,
			],
		}).compileComponents();

		service = TestBed.inject(FlashcardSetService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
