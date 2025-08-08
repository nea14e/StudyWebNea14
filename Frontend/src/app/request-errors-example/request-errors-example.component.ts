import {Component, inject} from '@angular/core';
import {TitleComponent} from '../common/title/title.component';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
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
      arithmeticActions:
        this.formBuilder.array([
          this.formBuilder.group({
            firstNumber: [3, Validators.required],
            secondNumber: [2, Validators.required],
            buttonTitle: [{value: 'Сложить числа', disabled: true}],
            action: [(actionForm: FormGroup) => this.onAdditionClick(actionForm, this)],
            result: [{value: undefined, disabled: true}]
          }),
          this.formBuilder.group({
            firstNumber: [3, Validators.required],
            secondNumber: [2, Validators.required],
            buttonTitle: [{value: 'Вычесть числа', disabled: true}],
            action: [(actionForm: FormGroup) => this.onSubstractionClick(actionForm, this)],
            result: [{value: undefined, disabled: true}]
          }),
          this.formBuilder.group({
            firstNumber: [3, Validators.required],
            secondNumber: [2, Validators.required],
            buttonTitle: [{value: 'Перемножить числа', disabled: true}],
            action: [(actionForm: FormGroup) => this.onMultiplicationClick(actionForm, this)],
            result: [{value: undefined, disabled: true}]
          })
        ])
    });
  }

  get arithmeticActions() {
    return (this.form.get('arithmeticActions')! as FormArray).controls as FormGroup[];
  }

  onAdditionClick(actionForm: FormGroup, this1: RequestErrorsExampleComponent) {
    const firstNumber = actionForm.get('firstNumber')!.value as number;
    const secondNumber = actionForm.get('secondNumber')!.value as number;
    this1.service.addition(firstNumber, secondNumber).subscribe(result => {
      actionForm.get('result')!.setValue(result);
    });
  }

  onSubstractionClick(actionForm: FormGroup, this1: RequestErrorsExampleComponent) {
    const firstNumber = actionForm.get('firstNumber')!.value as number;
    const secondNumber = actionForm.get('secondNumber')!.value as number;
    this1.service.substraction(firstNumber, secondNumber).subscribe(result => {
      actionForm.get('result')!.setValue(result);
    })
  }

  onMultiplicationClick(actionForm: FormGroup, this1: RequestErrorsExampleComponent) {
    const firstNumber = actionForm.get('firstNumber')!.value as number;
    const secondNumber = actionForm.get('secondNumber')!.value as number;
    this1.service.multiplication(firstNumber, secondNumber).subscribe(result => {
      actionForm.get('result')!.setValue(result);
    })
  }
}
