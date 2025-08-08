import {Component, inject} from '@angular/core';
import {TitleComponent} from '../common/title/title.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RequestErrorsExampleService} from './services/request-errors-example.service';

@Component({
  selector: 'app-request-errors-example',
  imports: [
    TitleComponent,
    ReactiveFormsModule
  ],
  templateUrl: './request-errors-example.component.html',
  styleUrl: './request-errors-example.component.css'
})
export class RequestErrorsExampleComponent {
  form: FormGroup;
  private service = inject(RequestErrorsExampleService);
  private formBuilder = inject(FormBuilder);

  constructor() {
    this.form = this.buildForm();
  }

  buildForm() {
    return this.formBuilder.group({
      addition: this.formBuilder.group({
        firstNumber: [3, Validators.required],
        secondNumber: [2, Validators.required],
        result: [undefined]
        result: [{value: undefined, disabled: true}]
      })
    });
  }

  get additionForm() {
    return this.form.get('addition')! as FormGroup;
  }

  onAdditionClick() {
    const firstNumber = this.additionForm.get('firstNumber')!.value as number;
    const secondNumber = this.additionForm.get('secondNumber')!.value as number;
    this.service.addition(firstNumber, secondNumber).subscribe(result => {
      this.additionForm.get('result')!.setValue(result);
    });
  }
}
