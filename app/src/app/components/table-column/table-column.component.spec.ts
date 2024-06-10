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

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {TableColumnComponent} from '@app/components/table-column/table-column.component';
import {LoginModalComponent} from "@app/components/login-modal/login-modal.component";
import {
	AlternativeAnswerEditorComponent
} from "@app/components/alternative-answer-editor/alternative-answer-editor.component";
import {
	ConfirmDeleteElementModalComponent
} from "@app/components/confirm-delete-element-modal/confirm-delete-element-modal.component";
import {DeckListCardComponent} from "@app/components/deck-list-card/deck-list-card.component";
import {
	ConfirmDeleteTableColumnModalComponent
} from "@app/components/confirm-delete-table-column-modal/confirm-delete-table-column-modal.component";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.07
 */
describe('TableColumnComponent', () => {
	let component: TableColumnComponent;
	let fixture: ComponentFixture<TableColumnComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				FormsModule,
				ReactiveFormsModule,
			],
			declarations: [
				TableColumnComponent,
				LoginModalComponent,
				AlternativeAnswerEditorComponent,
				ConfirmDeleteElementModalComponent,
				DeckListCardComponent,
				ConfirmDeleteTableColumnModalComponent,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(TableColumnComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
