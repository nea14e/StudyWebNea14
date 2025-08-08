import {TestBed} from '@angular/core/testing';

import {RequestErrorsExampleService} from './request-errors-example.service';

describe('RequestErrorsExampleService', () => {
  let service: RequestErrorsExampleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestErrorsExampleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
