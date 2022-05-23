import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationSetComponent } from './operation-set.component';

describe('OperationSetComponent', () => {
  let component: OperationSetComponent;
  let fixture: ComponentFixture<OperationSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationSetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
