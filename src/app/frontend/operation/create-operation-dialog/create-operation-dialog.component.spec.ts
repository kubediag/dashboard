import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOperationDialogComponent } from './create-operation-dialog.component';

describe('CreateOperationDialogComponent', () => {
  let component: CreateOperationDialogComponent;
  let fixture: ComponentFixture<CreateOperationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateOperationDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOperationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
