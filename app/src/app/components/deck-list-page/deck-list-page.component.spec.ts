import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckListPageComponent } from './deck-list-page.component';

describe('DeckListPageComponent', () => {
  let component: DeckListPageComponent;
  let fixture: ComponentFixture<DeckListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
