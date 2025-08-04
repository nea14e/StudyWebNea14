import {Component, inject, OnInit} from '@angular/core';
import {CrudExampleListItemModel} from './models/crud-example-list-item.model';
import {CrudExampleService} from './services/crud-example.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {TitleComponent} from '../common/title/title.component';

@Component({
  selector: 'app-crud-example',
  imports: [
    FormsModule,
    TitleComponent
  ],
  templateUrl: './crud-example.component.html',
  styleUrl: './crud-example.component.css'
})
export class CrudExampleComponent implements OnInit {
  listItems: CrudExampleListItemModel[] = [];
  private service = inject(CrudExampleService);
  private router = inject(Router);

  async ngOnInit() {
    await this.reloadList();
  }

  async reloadList() {
    this.listItems = await firstValueFrom(this.service.getList());
  }

  async onCreateClick() {
    await this.router.navigate(['crud-example', 'create']);
  }

  async onEditClick(item: CrudExampleListItemModel) {
    await this.router.navigate(['crud-example', 'edit', item.id]);
  }

  async onDeleteClick(item: CrudExampleListItemModel) {
    await firstValueFrom(this.service.delete(item.id));
    await this.reloadList();
  }
}
