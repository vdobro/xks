import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTableModalComponent } from './new-table-modal.component';

describe('NewTableModalComponent', () => {
  let component: NewTableModalComponent;
  let fixture: ComponentFixture<NewTableModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTableModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
