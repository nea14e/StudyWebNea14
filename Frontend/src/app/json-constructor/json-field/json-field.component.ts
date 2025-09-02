import {Component, inject, input} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {FieldType} from './models/json-field-type';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {JsonConstructorService} from '../services/json-constructor.service';

@Component({
  selector: 'app-json-field',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatSelectModule
  ],
  templateUrl: './json-field.component.html',
  styleUrl: './json-field.component.css'
})
export class JsonFieldComponent {
  isRoot = input<boolean>(false);
  nestingLevel = input<number>(0);

  private formBuilder = inject(FormBuilder);  // До вызова buildForm()
  form = input<FormGroup>(this.buildForm());
  private service = inject(JsonConstructorService);

  readonly FieldType = FieldType;
  readonly Object = Object;

  private buildForm(fieldName: string = '', fieldType: FieldType = FieldType.string, fieldValue: any = 'Qwerty') {
    const form: FormGroup = this.formBuilder.group({
      fieldName: [fieldName, (this.isRoot() ? undefined : Validators.required)],
      fieldType: [fieldType, Validators.required],
      fieldValue: [fieldValue, Validators.required],
    });
    form.get('fieldType')!.valueChanges.subscribe(newType => {
      let newControl: AbstractControl;
      switch (newType) {
        case FieldType.boolean:
          newControl = new FormControl(true);
          break;
        case FieldType.number:
          newControl = new FormControl(123.45);
          break;
        case FieldType.string:
          newControl = new FormControl('Qwerty');
          break;
        case FieldType.null:
          newControl = new FormControl({value: null, disabled: true});
          break;
        case FieldType.object:
          newControl = this.formBuilder.array([
            this.buildForm('id', FieldType.number, 111),
            this.buildForm('title', FieldType.string, 'Qwerty')
          ]);
          break;
        case FieldType.list:
          newControl = this.formBuilder.array([
            this.buildForm('index', FieldType.number, 1),
            this.buildForm('index', FieldType.number, 2),
            this.buildForm('index', FieldType.number, 3),
          ]);
          break;
        default:
          throw new Error(`Тип поля "${newType}" не предусмотрен!`);
      }
      console.log('Тип поля изменился, сгенерировано новое значение по умолчанию:', newControl.getRawValue());
      form.setControl('fieldValue', newControl);
    });
    return form;
  }

  get tabs() {
    return `&nbsp;`.repeat(5 * this.nestingLevel());
  }

  get fieldType() {
    return this.form().get('fieldType')?.value as FieldType;
  }

  get objectInnerFields() {
    const innerForm = this.form().get('fieldValue')! as FormArray;
    console.log('innerForm:', innerForm);
    console.log('innerForm.controls:', innerForm.controls);
    return innerForm.controls as FormGroup[];
  }

  async onEyeClick() {
    const totalValue = this.getTotalValue(this.form());
    console.log('totalValue:', totalValue);
    const jsonValue = JSON.stringify(totalValue);
    const formattedJsonValue = await this.service.prettify(jsonValue);
    console.log('formattedJsonValue:', formattedJsonValue);
  }

  getTotalValue(form: FormGroup) {
    const valueControl = form.get('fieldValue')!;
    const type = form.get('fieldType')!.value as FieldType;

    if (type === FieldType.object) {
      let value: any = {};
      const fieldFormGroups = (valueControl as FormArray).controls as FormGroup[];
      for (let fieldFormGroup of fieldFormGroups) {
        const fieldName = fieldFormGroup.get('fieldName')!.value as string;
        value[fieldName] = this.getTotalValue(fieldFormGroup);
      }
      return value;
    } else if (type === FieldType.list) {
      // TODO
    } else if (type === FieldType.null) {
      return null;
    }
    return valueControl.value;
  }
}
