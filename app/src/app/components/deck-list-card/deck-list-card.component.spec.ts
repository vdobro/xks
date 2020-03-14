import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeckListCardComponent} from './deck-list-card.component';

describe('DeckListCardComponent', () => {
	let component: DeckListCardComponent;
	let fixture: ComponentFixture<DeckListCardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeckListCardComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeckListCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
