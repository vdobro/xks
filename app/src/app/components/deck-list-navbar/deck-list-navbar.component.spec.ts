import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckListNavbarComponent } from './deck-list-navbar.component';

describe('DeckListNavbarComponent', () => {
  let component: DeckListNavbarComponent;
  let fixture: ComponentFixture<DeckListNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckListNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckListNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
