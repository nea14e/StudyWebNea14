import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestErrorsExampleService {
  private http = inject(HttpClient);

  addition(firstNumber: number, secondNumber: number) {
    return this.http.get<number>(
      environment.backendBaseUrl + '/api/request-errors-example/addition',
      {params: {firstNumber, secondNumber}}
    );
  }

  substraction(firstNumber: number, secondNumber: number) {
    return this.http.get<number>(
      environment.backendBaseUrl + '/api/request-errors-example/substraction',
      {params: {firstNumber, secondNumber}}
    );
  }

  multiplication(firstNumber: number, secondNumber: number) {
    return this.http.get<number>(
      environment.backendBaseUrl + '/api/request-errors-example/multiplication',
      {params: {firstNumber, secondNumber}}
    );
  }
}
