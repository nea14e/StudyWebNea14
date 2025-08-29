import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JsonFieldComponent} from './json-field.component';

describe('JsonFieldComponent', () => {
  let component: JsonFieldComponent;
  let fixture: ComponentFixture<JsonFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonFieldComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JsonFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
