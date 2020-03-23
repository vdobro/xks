import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDeckModalComponent } from './new-deck-modal.component';

describe('DeckDetailsComponent', () => {
  let component: NewDeckModalComponent;
  let fixture: ComponentFixture<NewDeckModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDeckModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDeckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
