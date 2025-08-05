import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TableOfContentsItem} from './data/table-of-contents';
import {TableOfContentsService} from './services/table-of-contents.service';
import {TitleComponent} from '../common/title/title.component';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Subscription} from 'rxjs';

@Component({
  selector: 'app-table-of-contents',
  imports: [
    TitleComponent,
    ReactiveFormsModule
  ],
  templateUrl: './table-of-contents.component.html',
  styleUrl: './table-of-contents.component.css'
})
export class TableOfContentsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private service = inject(TableOfContentsService);
  private formBuilder = inject(FormBuilder);
  private subscriptions: Subscription[] = [];

  constructor() {
    this.form = this.buildEmptyForm();
  }

  ngOnInit() {
    const querySubscription = this.form.get('query')!.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(_ => {
        this.load();
      });
    this.subscriptions.push(querySubscription);

    this.load();
  }

  load() {
    const query = this.form.get('query')!.value;
    console.log('load: query:', query);
    if (!query) {
      this.service.getEntireList().subscribe(data => {
        console.log('load: entire list:', data);
        this.updateForm(data);
      });
    } else {
      this.service.applyFilter(query).then(data => {
        console.log('load: apply filter:', data);
        this.updateForm(data);
      });
    }
  }

  private buildEmptyForm() {
    const form = this.formBuilder.group({
      query: [''],
      listItems: this.formBuilder.array([])
    });
    console.log('buildEmptyForm form:', form);
    return form;
  }

  private updateForm(data: TableOfContentsItem[]) {
    const listItems = this.formBuilder.array(data.map(item => {
      return {
        id: [item.id],
        path: [item.path],
        title: [item.title],
        description: [item.description]
      };
    }));
    this.form.setControl('listItems', listItems);
    console.log('updateForm: data:', data, 'form:', this.form);
  }

  get listItems() {
    return this.form.get('listItems')! as FormArray;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
