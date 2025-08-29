import {TestBed} from '@angular/core/testing';

import {JsonConstructorService} from './json-constructor.service';

describe('JsonConstructorService', () => {
  let service: JsonConstructorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonConstructorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
