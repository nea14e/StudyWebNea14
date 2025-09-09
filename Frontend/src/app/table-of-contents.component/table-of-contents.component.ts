import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TableOfContentsItem} from './data/table-of-contents';
import {TableOfContentsService} from './services/table-of-contents.service';
import {TitleComponent} from '../common/title/title.component';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {TableOfContentsListComponent} from './table-of-contents-list/table-of-contents-list.component';

@Component({
  selector: 'app-table-of-contents',
  imports: [
    TitleComponent,
    ReactiveFormsModule,
    TableOfContentsListComponent
  ],
  templateUrl: './table-of-contents.component.html',
  styleUrl: './table-of-contents.component.css'
})
export class TableOfContentsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  selectedItem?: TableOfContentsItem;
  private service = inject(TableOfContentsService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
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

    const isShowFullDescriptionSubscription = this.form.get('isShowFullDescription')!.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(_ => {
        this.updateDetailsForm();
      });
    this.subscriptions.push(isShowFullDescriptionSubscription);

    this.load();
  }

  load() {
    const query = this.form.get('query')!.value;
    console.log('load: query:', query);
    if (!query) {
      this.service.getEntireList().then(data => {
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

  selectItem(item: TableOfContentsItem | undefined) {
    this.selectedItem = item;
  }

  goToPage(item: TableOfContentsItem) {
    const path = item.path;
    if (!path)
      return;
    this.router.navigate([path]).then();
  }

  private buildEmptyForm() {
    const form = this.formBuilder.group({
      query: [''],
      isShowFullDescription: [false],
      listItems: this.formBuilder.array([])
    });
    console.log('buildEmptyForm form:', form);
    return form;
  }

  private getListForm(data: TableOfContentsItem[]): FormArray {
    return this.formBuilder.array(
      data.map(item => this.formBuilder.group({
          id: [item.id],
          path: [item.path],
          title: [item.title],
          description: [item.description],
        childes: this.getListForm(!!item.childes ? item.childes : []),
          isExpanded: [item.isExpanded]
        })
      ));
  }

  private updateForm(data: TableOfContentsItem[]) {
    const listForm = this.getListForm(data);
    this.form.setControl('listItems', listForm);
    console.log('updateForm: data:', data, 'form:', this.form);

    this.updateDetailsForm();
  }

  private updateDetailsForm() {
    if (this.isShowFullDescription) {
      this.selectedItem = undefined;
    } else {
      this.selectedItem = this.listItems.length > 0
        ? this.listItems.at(0).value as TableOfContentsItem
        : undefined;
    }
  }

  get listItems() {
    return this.form.get('listItems')! as FormArray;
  }

  get isShowFullDescription() {
    return this.form.get('isShowFullDescription')!.value as boolean;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
