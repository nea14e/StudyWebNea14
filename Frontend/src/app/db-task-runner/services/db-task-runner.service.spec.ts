import {TestBed} from '@angular/core/testing';

import {DbTaskRunnerService} from './db-task-runner.service';

describe('BaseDbTaskRunnerService', () => {
  let service: DbTaskRunnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbTaskRunnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
