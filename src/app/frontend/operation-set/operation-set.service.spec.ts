import { TestBed } from '@angular/core/testing';

import { OperationSetService } from './operation-set.service';

describe('OperationSetService', () => {
  let service: OperationSetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationSetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
