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

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeckViewTableListElement} from './deck-view-table-list-element.component';
import {Component, ViewChild} from "@angular/core";
import {v4 as uuid} from 'uuid';
import {Table} from "../../models/Table";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.06.11
 */
describe('DeckViewTableListElementComponent', () => {
	let component: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeckViewTableListElement, TestHostComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestHostComponent);
		component = fixture.componentInstance;
		component.table = generateTable();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	@Component({
		selector: 'host-component',
		template: `
			<li deck-elements [table]="table"></li>`
	})
	class TestHostComponent {
		@ViewChild(DeckViewTableListElement)
		public componentUnderTest;

		table: Table;
	}
});

function generateTable(): Table {
	return {
		id: uuid(),
		deckId: uuid() + 'as deck ID',
		name: 'name ' + uuid()
	};
}
