import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment';

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
}
