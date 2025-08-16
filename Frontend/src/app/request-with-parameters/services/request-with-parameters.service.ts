import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment';
import {filterToParams, RequestWithComplexParametersFilter} from '../models/request-with-complex-parameters-filter';
import {RequestWithComplexParametersListItem} from '../models/request-with-complex-parameters-list-item';
import {PostRequestRequestBody} from '../models/post-request-request-body';
import {PostRequestResponseBody} from '../models/post-request-response-body';

@Injectable({
  providedIn: 'root'
})
export class RequestWithParametersService {
  private httpClient = inject(HttpClient);

  requestWithAddressParams(firstParam: number, secondParam: number) {
    // Эти параметры вставляются в адрес запроса
    return firstValueFrom(
      this.httpClient.get<string>(environment.backendBaseUrl + `/api/request-with-parameters/address-params/${firstParam}/${secondParam}`)
    );  // Параметры различаются по месту вставки - первое, второе и так далее
  }

  requestWithQueryParams(firstParam: number, secondParam: number) {
    // Эти параметры будут в адресе запроса после "?"
    return firstValueFrom(
      this.httpClient.get<string>(environment.backendBaseUrl + `/api/request-with-parameters/query-params`,
        {params: {oneParam: firstParam, anotherParam: secondParam}}  // Они различаются по названию
      )
    );
  }

  requestWithComplexParams(filter: RequestWithComplexParametersFilter) {
    return firstValueFrom(
      this.httpClient.get<RequestWithComplexParametersListItem[]>(environment.backendBaseUrl + '/api/request-with-parameters/complex-params',
        {params: filterToParams(filter)})  // Превращаем составной объект filter в набор параметров: 1 поле в 1 параметр
    );
  }

  requestWithPostBody(body: PostRequestRequestBody) {
    return firstValueFrom(
      this.httpClient.post<PostRequestResponseBody>(environment.backendBaseUrl + `/api/request-with-parameters/post-request`, body)
    )
  }
}
