import {Component, inject} from '@angular/core';
import {TitleComponent} from '../common/title/title.component';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RequestWithParametersService} from './services/request-with-parameters.service';
import {RequestWithComplexParametersFilter} from './models/request-with-complex-parameters-filter';
import {RequestWithComplexParametersListItem} from './models/request-with-complex-parameters-list-item';

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
      complexParams: this.formBuilder.group({
        title: [undefined],
        dateFrom: [undefined],
        dateTo: [undefined],
        result: this.formBuilder.array([])
      }),
      postParams: this.formBuilder.group({
        firstParam: [2, Validators.required],
        secondParam: [1, Validators.required],
        body: ['Qwerty Uiop Asdfghjkl Zxc Vbnm Qwerty Uiop Asdfghjkl Zxc Vbnm Qwerty Uiop Asdfghjkl Zxc Vbnm', Validators.required],
        result: [{value: undefined, disabled: true}]
      }),
    })
  }

  private buildComplexParamsResultForm(data: RequestWithComplexParametersListItem[]) {
    const resultForm = this.formBuilder.array(
      data.map(item => this.formBuilder.group({
        id: item.id,
        title: item.title,
        date: item.date
      }))
    );
    this.complexParamsForm.setControl('result', resultForm);
  }

  get addressParamsForm() {
    return this.form.get('addressParams')! as FormGroup;
  }

  get queryParamsForm() {
    return this.form.get('queryParams')! as FormGroup;
  }

  get complexParamsForm() {
    return this.form.get('complexParams')! as FormGroup;
  }

  get complexParamsResult() {
    return this.complexParamsForm.get('result')! as FormArray;
  }

  get postParamsForm() {
    return this.form.get('postParams')! as FormGroup;
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

  onClearFilterClick(paramName: string) {
    this.complexParamsForm.get(paramName)!.setValue(undefined);
  }

  onComplexParamsClick() {
    const title = this.complexParamsForm.get('title')!.value as string;
    const dateFrom = this.complexParamsForm.get('dateFrom')!.value as string;
    const dateTo = this.complexParamsForm.get('dateTo')!.value as string;

    const filter = {
      title,
      dateFrom,
      dateTo,
    } as RequestWithComplexParametersFilter;

    // Передаём в сервис один составной объект вместо нескольких отдельных параметров
    this.service.requestWithComplexParams(filter).then(
      result => {
        this.buildComplexParamsResultForm(result);
      }
    );
  }
}
