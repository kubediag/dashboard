import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOperationSetComponent } from './create-operation-set.component';

describe('CreateOperationSetComponent', () => {
  let component: CreateOperationSetComponent;
  let fixture: ComponentFixture<CreateOperationSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateOperationSetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOperationSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
