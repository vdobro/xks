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

import {DeckListCardComponent} from './deck-list-card.component';
import {Component, ViewChild} from "@angular/core";
import {Deck} from "../../models/Deck";
import {v4 as uuid} from 'uuid';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('DeckListCardComponent', () => {
	let component: TestHostComponent;
	let fixture: ComponentFixture<TestHostComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
			],
			declarations: [DeckListCardComponent, TestHostComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestHostComponent);
		component = fixture.componentInstance;
		component.deck = generateDeck();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	@Component({
		selector: 'host-component',
		template: `
			<app-deck-list-card [deck]=deck></app-deck-list-card>`
	})
	class TestHostComponent {
		@ViewChild(DeckListCardComponent)
		public componentUnderTest : DeckListCardComponent | undefined;

		deck: Deck | null = null;
	}
});

function generateDeck(): Deck {
	return {
		id: uuid(),
		name: uuid() + ' name',
		description: uuid() + ' description'
	}
}
