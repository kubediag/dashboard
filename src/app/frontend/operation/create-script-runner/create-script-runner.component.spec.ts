import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScriptRunnerComponent } from './create-script-runner.component';

describe('CreateScriptRunnerComponent', () => {
  let component: CreateScriptRunnerComponent;
  let fixture: ComponentFixture<CreateScriptRunnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateScriptRunnerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateScriptRunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
