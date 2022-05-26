import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerCardComponent } from './trigger-card.component';

describe('TriggerCardComponent', () => {
  let component: TriggerCardComponent;
  let fixture: ComponentFixture<TriggerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TriggerCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriggerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
