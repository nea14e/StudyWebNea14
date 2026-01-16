import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ViewJsonDialog} from './view-json-dialog';

describe('ViewJsonDialog', () => {
  let component: ViewJsonDialog;
  let fixture: ComponentFixture<ViewJsonDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewJsonDialog]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewJsonDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
