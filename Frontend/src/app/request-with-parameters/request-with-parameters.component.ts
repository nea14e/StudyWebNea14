import {Component, inject} from '@angular/core';
import {TitleComponent} from '../common/title/title.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RequestWithParametersService} from './services/request-with-parameters.service';

@Component({
  selector: 'app-request-with-parameters',
  imports: [
    TitleComponent,
    ReactiveFormsModule
  ],
  templateUrl: './request-with-parameters.component.html',
  styleUrl: './request-with-parameters.component.css'
})
export class RequestWithParametersComponent {
  form: FormGroup;
  private formBuilder = inject(FormBuilder);
  private service = inject(RequestWithParametersService);

  constructor() {
    this.form = this.buildForm();
  }

  private buildForm() {
    return this.formBuilder.group({
      addressParams: this.formBuilder.group({
        firstParam: [2, Validators.required],
        secondParam: [1, Validators.required],
        result: [{value: undefined, disabled: true}]
      }),
      queryParams: this.formBuilder.group({
        firstParam: [2, Validators.required],
        secondParam: [1, Validators.required],
        result: [{value: undefined, disabled: true}]
      }),
      postParams: this.formBuilder.group({
        firstParam: [2, Validators.required],
        secondParam: [1, Validators.required],
        body: ['Qwerty Uiop Asdfghjkl Zxc Vbnm Qwerty Uiop Asdfghjkl Zxc Vbnm Qwerty Uiop Asdfghjkl Zxc Vbnm', Validators.required],
        result: [{value: undefined, disabled: true}]
      }),
      complexParams: this.formBuilder.group({
        firstParam: [2, Validators.required],
        secondParam: [1, Validators.required],
        body: ['Qwerty Uiop Asdfghjkl Zxc Vbnm Qwerty Uiop Asdfghjkl Zxc Vbnm Qwerty Uiop Asdfghjkl Zxc Vbnm', Validators.required],
        result: [{value: undefined, disabled: true}]
      }),
    })
  }

  get addressParamsForm() {
    return this.form.get('addressParams')! as FormGroup;
  }

  get queryParamsForm() {
    return this.form.get('queryParams')! as FormGroup;
  }

  get postParamsForm() {
    return this.form.get('postParams')! as FormGroup;
  }

  get complexParamsForm() {
    return this.form.get('complexParams')! as FormGroup;
  }

  onAddressParamsClick() {
    const firstParam = this.addressParamsForm.get('firstParam')!.value as number;
    const secondParam = this.addressParamsForm.get('secondParam')!.value as number;
    this.service.requestWithAddressParams(firstParam, secondParam).then(
      result => {
        this.addressParamsForm.get('result')!.setValue(result);
      }
    );
  }

  onQueryParamsClick() {
    const firstParam = this.queryParamsForm.get('firstParam')!.value as number;
    const secondParam = this.queryParamsForm.get('secondParam')!.value as number;
    // Параметры передаются в сервис как и раньше, но внутри сервиса есть различия
    this.service.requestWithQueryParams(firstParam, secondParam).then(
      result => {
        this.queryParamsForm.get('result')!.setValue(result);
      }
    );
  }
}
