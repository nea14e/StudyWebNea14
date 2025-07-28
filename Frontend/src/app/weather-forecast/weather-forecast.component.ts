import {Component, inject, OnInit} from '@angular/core';
import {WeatherForecastService} from './services/weather-forecast.service';
import {WeatherForecastItemModel} from './models/weather-forecast-item.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-weather-forecast',
  imports: [
    DatePipe
  ],
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.css'
})
export class WeatherForecastComponent implements OnInit {
  data: WeatherForecastItemModel[] = [];
  private service = inject(WeatherForecastService);

  ngOnInit(): void {
    this.service.getRandomList()
      .subscribe(data => {
        this.data = data;
      });
  }
}
