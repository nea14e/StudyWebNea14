import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SimpleRequest2Component} from './simple-request-2.component';

describe('SimpleRequestComponent', () => {
  let component: SimpleRequest2Component;
  let fixture: ComponentFixture<SimpleRequest2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleRequest2Component]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SimpleRequest2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
