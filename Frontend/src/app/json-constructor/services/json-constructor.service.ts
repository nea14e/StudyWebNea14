import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JsonConstructorService {
  private httpClient = inject(HttpClient);

  prettify(json: string) {
    const headers = new HttpHeaders({'Content-Type': 'text/plain'});
    return firstValueFrom(
      this.httpClient.post<string>(environment.backendBaseUrl + '/api/json-constructor/prettify', json, {headers: headers})
    )
  }
}
