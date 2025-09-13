import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DbTaskRunnerComponent} from './db-task-runner.component';

describe('ConcurrentUpdateComponent', () => {
  let component: DbTaskRunnerComponent;
  let fixture: ComponentFixture<DbTaskRunnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbTaskRunnerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DbTaskRunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
