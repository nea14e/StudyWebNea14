import {Component, inject, input, output} from '@angular/core';
import {FormArray, FormBuilder} from '@angular/forms';
import {TableOfContentsItem} from '../data/table-of-contents';
import {Router} from '@angular/router';

@Component({
  selector: 'app-table-of-contents-list',
  imports: [],
  templateUrl: './table-of-contents-list.component.html',
  styleUrl: './table-of-contents-list.component.css'
})
export class TableOfContentsListComponent {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  listItems = input<FormArray>(this.formBuilder.array([]));
  selectedItem = input<TableOfContentsItem | undefined>(undefined);
  isShowFullDescription = input(false);
  nestingLevel = input(0);
  selectItem = output<TableOfContentsItem | undefined>();
  goToPage = output<TableOfContentsItem>();

  onExpandedClick(item: any) {
    const oldValue = item.get('isExpanded')!.value as boolean;
    const newValue = !oldValue;
    item.get('isExpanded')!.setValue(newValue);
  }

  onItemClicked(item: TableOfContentsItem) {
    this.selectItem.emit(item);
    if (this.isShowFullDescription()) {
      this.goToPage.emit(item);
    }
  }

  getTabs() {
    return '&nbsp;'.repeat(8 * this.nestingLevel());
  }

  getItemChildes(item: any) {
    return item.get('childes') as FormArray;
  }

  onSelectItem(item: TableOfContentsItem | undefined) {
    this.selectItem.emit(item);
  }

  onGoToPage(item: TableOfContentsItem) {
    this.goToPage.emit(item);
  }
}
