import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHttpServerComponent } from './create-http-server.component';

describe('CreateHttpServerComponent', () => {
  let component: CreateHttpServerComponent;
  let fixture: ComponentFixture<CreateHttpServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateHttpServerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHttpServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
