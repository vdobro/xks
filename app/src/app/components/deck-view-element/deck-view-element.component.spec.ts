import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckViewElementComponent } from './deck-view-element.component';

describe('DeckViewElementComponent', () => {
  let component: DeckViewElementComponent;
  let fixture: ComponentFixture<DeckViewElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckViewElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckViewElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
