import {Component, inject} from '@angular/core';
import {TitleComponent} from '../common/title/title.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {NgClass} from '@angular/common';

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
    this.httpClient.get<string>(environment.backendBaseUrl + '/api/simple-request/get').subscribe({
      next: response => {
        console.log('Пришёл ответ:', response);
        this.result = response;
        this.isSuccess = true;
      },
      error: error => {
        console.log('Ошибка запроса:', error);
        const message = 'Ошибка запроса: ' + error.message;
        alert(message);
        this.result = message;
        this.isSuccess = false;
      }
    });
  }
}
