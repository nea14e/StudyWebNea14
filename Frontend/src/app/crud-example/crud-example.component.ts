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
  private service = inject(CrudExampleService);

  ngOnInit() {
    this.reloadList();
  }

  reloadList() {
    this.service.getList().subscribe(data => {
      this.listItems = data;
    });
  }

  onEditClick(item: CrudExampleItemModel) {
    this.details = undefined;
    this.service.read(item.id).subscribe(data => {
      this.details = data;
    })
  }
}
