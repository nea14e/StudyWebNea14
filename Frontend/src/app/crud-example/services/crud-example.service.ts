import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudExampleItemModel} from '../models/crud-example-item.model';
import {environment} from '../../../environments/environment';
import {CrudExampleDetailsModel} from '../models/crud-example-details.model';
import {Guid} from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class CrudExampleService {
  private http = inject(HttpClient);

  getList() {
    return this.http.get<CrudExampleItemModel[]>(environment.backendBaseUrl + '/api/crud-example/get-list');
  }

  create(detailsDto: CrudExampleDetailsModel) {
    return this.http.post<void>(environment.backendBaseUrl + '/api/crud-example/create', detailsDto);
  }

  read(id: Guid) {
    return this.http.get<CrudExampleDetailsModel>(environment.backendBaseUrl + '/api/crud-example/read/' + id);
  }

  update(detailsDto: CrudExampleDetailsModel) {
    return this.http.post<void>(environment.backendBaseUrl + '/api/crud-example/update', detailsDto);
  }
}
