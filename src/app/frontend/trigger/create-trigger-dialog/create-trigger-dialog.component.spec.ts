import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTriggerDialogComponent } from './create-trigger-dialog.component';

describe('CreateTriggerDialogComponent', () => {
  let component: CreateTriggerDialogComponent;
  let fixture: ComponentFixture<CreateTriggerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTriggerDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTriggerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
