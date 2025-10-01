import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DbTaskResultDialog} from './db-task-result-dialog';

describe('DbTaskResultDialog', () => {
  let component: DbTaskResultDialog;
  let fixture: ComponentFixture<DbTaskResultDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbTaskResultDialog]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DbTaskResultDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
