import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCronComponent } from './create-cron.component';

describe('CreateCronComponent', () => {
  let component: CreateCronComponent;
  let fixture: ComponentFixture<CreateCronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCronComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
