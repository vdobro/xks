import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeckListViewComponent} from './deck-list-view.component';

describe('DeckListViewComponent', () => {
	let component: DeckListViewComponent;
	let fixture: ComponentFixture<DeckListViewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeckListViewComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeckListViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
