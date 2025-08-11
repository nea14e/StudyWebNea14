import {Component, inject} from '@angular/core';
import {TitleComponent} from '../common/title/title.component';
import {NgClass} from '@angular/common';
import {SimpleRequest2Service} from './services/simple-request-2.service';

@Component({
  selector: 'app-simple-request-2',
  imports: [
    TitleComponent,
    NgClass
  ],
  templateUrl: './simple-request-2.component.html',
  styleUrl: './simple-request-2.component.css'
})
export class SimpleRequest2Component {
  result = 'Сначала пошлите запрос.';
  isSuccess?: boolean = undefined;
  private service = inject(SimpleRequest2Service);

  onClick() {
    console.log('Кнопка нажата, посылаем запрос...');
    this.service.get().then(  // Сетевой запрос вынесен в сервис
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
