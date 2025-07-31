import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudExampleItemModel} from '../models/crud-example-item.model';
import {environment} from '../../../environments/environment';
import {Guid} from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class CrudExampleService {
  private http = inject(HttpClient);

  getList() {
    return this.http.get<CrudExampleItemModel[]>(environment.backendBaseUrl + '/api/crud-example/get-list');
  }

  delete(id: Guid) {
    return this.http.delete(environment.backendBaseUrl + '/api/crud-example/delete/' + id);
  }
}
