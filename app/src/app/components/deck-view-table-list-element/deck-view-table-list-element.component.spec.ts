import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckViewTableListElement } from './deck-view-table-list-element.component';

describe('DeckViewTableListElementComponent', () => {
  let component: DeckViewTableListElement;
  let fixture: ComponentFixture<DeckViewTableListElement>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckViewTableListElement ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckViewTableListElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
