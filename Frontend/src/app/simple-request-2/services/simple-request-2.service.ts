import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimpleRequest2Service {
  private httpClient = inject(HttpClient);

  get() {
    return firstValueFrom(this.httpClient.get<string>(environment.backendBaseUrl + '/api/simple-request-2/get'));
  }
}
