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
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

import {SidebarTableListElementComponent} from "@app/components/sidebar-deck-element/sidebar-table-list-element.component";

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.09.12
 */
describe('SidebarTableListElementComponent', () => {
	let component: SidebarTableListElementComponent;
	let fixture: ComponentFixture<SidebarTableListElementComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule
			],
			declarations: [SidebarTableListElementComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SidebarTableListElementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
