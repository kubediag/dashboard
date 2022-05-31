import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrometheusRuleComponent } from './create-prometheus-rule.component';

describe('CreatePrometheusRuleComponent', () => {
  let component: CreatePrometheusRuleComponent;
  let fixture: ComponentFixture<CreatePrometheusRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatePrometheusRuleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePrometheusRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
