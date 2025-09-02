import {Component, inject, input} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FieldType} from './models/json-field-type';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

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
          newControl = this.formBuilder.group({
            id: this.buildForm('id', FieldType.number, 111),
            title: this.buildForm('title', FieldType.string, 'Qwerty')
          });
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
}
