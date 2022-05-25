import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationCardComponent } from './operation-card.component';

describe('OperationCardComponent', () => {
  let component: OperationCardComponent;
  let fixture: ComponentFixture<OperationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
