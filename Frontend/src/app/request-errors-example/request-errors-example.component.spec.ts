import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RequestErrorsExampleComponent} from './request-errors-example.component';

describe('RequestErrorsExampleComponent', () => {
  let component: RequestErrorsExampleComponent;
  let fixture: ComponentFixture<RequestErrorsExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestErrorsExampleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RequestErrorsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
