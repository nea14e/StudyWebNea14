import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RequestWithParametersComponent} from './request-with-parameters.component';

describe('RequestWithParametersComponent', () => {
  let component: RequestWithParametersComponent;
  let fixture: ComponentFixture<RequestWithParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestWithParametersComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RequestWithParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
