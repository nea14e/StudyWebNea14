import {Component, inject, input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-json-field',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './json-field.component.html',
  styleUrl: './json-field.component.css'
})
export class JsonFieldComponent {
  isRoot = input<boolean>(false);
  nestingLevel = input<number>(0);

  form: FormGroup;
  private formBuilder = inject(FormBuilder);

  constructor() {
    this.form = this.buildForm();
  }

  get tabs() {
    return `&nbsp;`.repeat(this.nestingLevel());
  }

  private buildForm() {
    return this.formBuilder.group({
      fieldName: ['', (this.isRoot() ? undefined : Validators.required)],
    })
  }
}
