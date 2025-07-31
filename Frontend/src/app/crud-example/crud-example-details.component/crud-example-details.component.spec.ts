import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CrudExampleDetailsComponent} from './crud-example-details.component';

describe('CrudExampleDetailsComponent', () => {
  let component: CrudExampleDetailsComponent;
  let fixture: ComponentFixture<CrudExampleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudExampleDetailsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CrudExampleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
