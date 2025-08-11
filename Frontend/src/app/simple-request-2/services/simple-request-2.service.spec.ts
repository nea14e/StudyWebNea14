import {TestBed} from '@angular/core/testing';

import {SimpleRequest2Service} from './simple-request-2.service';

describe('SimpleRequest2Service', () => {
  let service: SimpleRequest2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimpleRequest2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
