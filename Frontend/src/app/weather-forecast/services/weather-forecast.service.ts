import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherForecastService {
  private http = inject(HttpClient);

  getRandomList() {
    return this.http.get<any>(environment.backendBaseUrl + '/api/weather-forecast/get-random-list');
  }
}
