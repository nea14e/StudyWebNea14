import {TestBed} from '@angular/core/testing';

import {CrudExampleDetailsService} from './crud-example-details.service';

describe('CrudExample', () => {
  let service: CrudExampleDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudExampleDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
