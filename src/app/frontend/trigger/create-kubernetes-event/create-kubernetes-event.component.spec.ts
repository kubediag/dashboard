import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKubernetesEventComponent } from './create-kubernetes-event.component';

describe('CreateKubernetesEventComponent', () => {
  let component: CreateKubernetesEventComponent;
  let fixture: ComponentFixture<CreateKubernetesEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateKubernetesEventComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateKubernetesEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
