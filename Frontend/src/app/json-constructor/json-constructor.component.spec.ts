import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JsonConstructorComponent} from './json-constructor.component';

describe('JsonConstructorComponent', () => {
  let component: JsonConstructorComponent;
  let fixture: ComponentFixture<JsonConstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonConstructorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JsonConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
