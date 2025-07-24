import {Component, inject, OnInit} from '@angular/core';
import {WeatherForecastService} from './services/weather-forecast.service';

@Component({
  selector: 'app-weather-forecast',
  imports: [],
  templateUrl: './weather-forecast.html',
  styleUrl: './weather-forecast.css'
})
export class WeatherForecast implements OnInit {
  private service = inject(WeatherForecastService);

  ngOnInit(): void {
    this.service.getRandomList()
      .subscribe(data => {
        console.log('Component:', data);
      });
  }
}
