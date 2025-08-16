import {Component, inject} from '@angular/core';
import {TitleComponent} from '../common/title/title.component';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RequestWithParametersService} from './services/request-with-parameters.service';
import {RequestWithComplexParametersFilter} from './models/request-with-complex-parameters-filter';
import {RequestWithComplexParametersListItem} from './models/request-with-complex-parameters-list-item';
import {PostRequestRequestBody} from './models/post-request-request-body';

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
        params: this.formBuilder.array([
          new FormControl(1, Validators.required)
        ]),
        resultText: [{value: undefined, disabled: true}]
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

  get postParamsList() {
    return this.postParamsForm.get('params')! as FormArray;
  }

  get postParamsListControls() {
    return (this.postParamsForm.get('params')! as FormArray).controls as FormControl[];
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

  onComplexParamsClearFilterClick(paramName: string) {
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

  onPostParamsClearFilterClick(i: number) {
    this.postParamsList.removeAt(i);
  }

  onAddPostParamClick() {
    const newControl = new FormControl(1, Validators.required);
    this.postParamsList.push(newControl);
  }

  onPostParamsClick() {
    const items = this.postParamsList.getRawValue() as number[];
    console.log('onPostParamsClick(): items:', items);
    const requestBody = {
      items: items
    } as PostRequestRequestBody;
    this.service.requestWithPostBody(requestBody).then(response => {
      const resultText = `Количество элементов: ${response.count}, сумма: ${response.sum}, среднее значение: ${response.average}`;
      this.postParamsForm.get('resultText')!.setValue(resultText);
    });
  }
}
