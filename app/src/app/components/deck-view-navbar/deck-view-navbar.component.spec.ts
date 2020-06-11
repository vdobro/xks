import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckViewNavbarComponent } from './deck-view-navbar.component';

describe('DeckViewNavbarComponent', () => {
  let component: DeckViewNavbarComponent;
  let fixture: ComponentFixture<DeckViewNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckViewNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckViewNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
