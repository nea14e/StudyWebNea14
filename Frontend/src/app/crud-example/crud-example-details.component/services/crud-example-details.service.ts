import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Guid} from 'guid-typescript';
import {CrudExampleDetailsModel} from '../models/crud-example-details.model';
import {environment} from '../../../../environments/environment';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudExampleDetailsService {
  private http = inject(HttpClient);

  create(detailsDto: CrudExampleDetailsModel) {
    return firstValueFrom(this.http.post<void>(environment.backendBaseUrl + '/api/crud-example/create', detailsDto));
  }

  read(id: Guid) {
    return firstValueFrom(this.http.get<CrudExampleDetailsModel>(environment.backendBaseUrl + '/api/crud-example/read/' + id));
  }

  update(detailsDto: CrudExampleDetailsModel) {
    return firstValueFrom(this.http.post<void>(environment.backendBaseUrl + '/api/crud-example/update', detailsDto));
  }
}
