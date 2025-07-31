import {Component, inject, OnInit} from '@angular/core';
import {CrudExampleItemModel} from './models/crud-example-item.model';
import {CrudExampleService} from './services/crud-example.service';
import {CrudExampleDetailsModel} from './models/crud-example-details.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-crud-example',
  imports: [
    FormsModule
  ],
  templateUrl: './crud-example.component.html',
  styleUrl: './crud-example.component.css'
})
export class CrudExampleComponent implements OnInit {
  listItems: CrudExampleItemModel[] = [];
  details?: CrudExampleDetailsModel;
  isNew = false;
  private service = inject(CrudExampleService);

  ngOnInit() {
    this.reloadList();
  }

  reloadList() {
    this.service.getList().subscribe(data => {
      this.listItems = data;
    });
  }

  onCreateClick() {
    this.details = {} as CrudExampleDetailsModel;
    this.isNew = true;
  }

  onEditClick(item: CrudExampleItemModel) {
    this.details = undefined;
    this.service.read(item.id).subscribe(data => {
      this.details = data;
      this.isNew = false;
    })
  }

  onSaveClick() {
    let observable;
    if (this.isNew) {
      observable = this.service.create(this.details!);
    } else {
      observable = this.service.update(this.details!);
    }
    observable.subscribe(_ => {
      this.details = undefined;
      this.reloadList();
    })
  }

  onDeleteClick(item: CrudExampleItemModel) {
    this.service.delete(item.id).subscribe(_ => {
      this.reloadList();
      if (this.details?.id === item.id) {
        this.details = undefined;
      }
    })
  }

  onCancelClick() {
    this.details = undefined;
  }
}
