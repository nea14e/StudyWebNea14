import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudExampleListItemModel} from '../models/crud-example-list-item.model';
import {environment} from '../../../environments/environment';
import {Guid} from 'guid-typescript';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudExampleService {
  private http = inject(HttpClient);

  getList() {
    return firstValueFrom(this.http.get<CrudExampleListItemModel[]>(environment.backendBaseUrl + '/api/crud-example/get-list'));
  }

  delete(id: Guid) {
    return firstValueFrom(this.http.delete(environment.backendBaseUrl + '/api/crud-example/delete/' + id));
  }
}
