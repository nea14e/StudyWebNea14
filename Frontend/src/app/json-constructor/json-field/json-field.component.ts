import {Component, inject, input, output} from '@angular/core';
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
import {ViewJsonDialog} from './dialogs/view-json-dialog/view-json-dialog';
import {MatDialog} from '@angular/material/dialog';

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
  private readonly NEW_FIELD_NAME_PATTERN = 'field _';
  private readonly NEW_FIELD_TYPE = FieldType.string;
  private readonly NEW_FIELD_VALUE_PATTERN = 'value _';

  isRoot = input<boolean>(false);
  nestingLevel = input<number>(0);

  private formBuilder = inject(FormBuilder);  // До вызова buildForm()
  form = input<FormGroup>(this.buildForm());
  hasName = input<boolean>(true);
  private service = inject(JsonConstructorService);
  private dialog = inject(MatDialog);

  onDeleteField = output<void>();

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
          newControl = new FormControl(true, Validators.required);
          break;
        case FieldType.number:
          newControl = new FormControl(123.45, Validators.required);
          break;
        case FieldType.string:
          newControl = new FormControl('Qwerty', Validators.required);
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
            this.buildForm('', FieldType.number, 1),
            this.buildForm('', FieldType.number, 2),
            this.buildForm('', FieldType.number, 3),
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

  get innerFields() {
    const innerForm = this.form().get('fieldValue')! as FormArray;
    return innerForm.controls as FormGroup[];
  }

  async onEyeClick() {
    const totalValue = this.getTotalValue(this.form());
    console.log('totalValue:', totalValue);
    const jsonValue = JSON.stringify(totalValue);
    const formattedJsonValue = await this.service.prettify(jsonValue);
    console.log('formattedJsonValue:', formattedJsonValue);
    this.dialog.open(ViewJsonDialog, {
      data: formattedJsonValue
    });
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
      let listValue: any[] = [];
      const listControls = (valueControl as FormArray).controls as FormGroup[];
      for (let listControl of listControls) {
        listValue.push(this.getTotalValue(listControl));
      }
      return listValue;
    } else if (type === FieldType.null) {
      return null;
    }
    return valueControl.value;
  }

  onDeleteFieldClick() {
    this.onDeleteField.emit();
  }

  deleteInnerField(i: number) {
    const outerControl = this.form().get('fieldValue')! as FormArray;
    outerControl.controls = outerControl.controls
      .filter((_value, index) => index !== i);
  }

  onAddFieldClick() {
    let newFieldName: string;
    let newFieldValue: any;

    if (this.fieldType === FieldType.object) {
      const newFieldNumber = this.innerFields.length + 1;
      newFieldName = this.NEW_FIELD_NAME_PATTERN.replace('_', newFieldNumber.toString());
      newFieldValue = this.NEW_FIELD_VALUE_PATTERN.replace('_', newFieldNumber.toString());
    } else if (this.fieldType === FieldType.list) {
      const newFieldNumber = this.innerFields.length + 1;
      newFieldName = '';
      newFieldValue = this.NEW_FIELD_VALUE_PATTERN.replace('_', newFieldNumber.toString());
    } else {
      throw new Error('Другой тип вложенных полей не предусмотрен.')
    }

    const formArray = this.form().get('fieldValue')! as FormArray;
    formArray.controls.push(this.buildForm(newFieldName, this.NEW_FIELD_TYPE, newFieldValue))
  }
}
