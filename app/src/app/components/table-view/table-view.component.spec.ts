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

import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {TableViewComponent} from './table-view.component';
import {Component, ViewChild} from "@angular/core";
import {Table} from "@app/models/Table";
import {v4 as uuid} from 'uuid';

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.08.03
 */
describe('TableViewComponent', () => {
	let component: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [TableViewComponent]
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
			<app-table-view></app-table-view>`
	})
	class TestHostComponent {
		@ViewChild(TableViewComponent)
		public componentUnderTest: TableViewComponent | undefined;

		table: Table | null = null;
	}
});

function generateTable(): Table {
	return {
		id: uuid(),
		deckId: uuid() + 'as deck ID',
		name: 'name ' + uuid(),
		sessionModes: [],
		defaultMaxScore: 8,
		defaultStartingScore: 3,
		defaultSessionModeId: uuid(),
		columns: [],
		rows: []
	};
}
