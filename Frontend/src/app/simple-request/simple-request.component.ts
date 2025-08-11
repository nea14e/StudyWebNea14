import {Component, inject} from '@angular/core';
import {TitleComponent} from '../common/title/title.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {NgClass} from '@angular/common';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-simple-request',
  imports: [
    TitleComponent,
    NgClass
  ],
  templateUrl: './simple-request.component.html',
  styleUrl: './simple-request.component.css'
})
export class SimpleRequestComponent {
  result = 'Сначала пошлите запрос.';
  isSuccess?: boolean = undefined;
  private httpClient = inject(HttpClient);

  onClick() {
    console.log('Кнопка нажата, посылаем запрос...');
    firstValueFrom(this.httpClient.get<string>(environment.backendBaseUrl + '/api/simple-request/get')).then(
      response => {
        console.log('Пришёл ответ:', response);
        this.result = response;
        this.isSuccess = true;
      },
      error => {
        console.log('Ошибка запроса:', error);
        const message = 'Ошибка запроса: ' + error.message;
        alert(message);
        this.result = message;
        this.isSuccess = false;
      }
    );
  }
}
