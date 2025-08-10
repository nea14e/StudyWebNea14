import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SimpleRequestComponent} from './simple-request.component';

describe('SimpleRequestComponent', () => {
  let component: SimpleRequestComponent;
  let fixture: ComponentFixture<SimpleRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleRequestComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SimpleRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
