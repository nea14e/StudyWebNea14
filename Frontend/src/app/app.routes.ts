import {Routes} from '@angular/router';
import {WeatherForecast} from './weather-forecast/weather-forecast';

export const routes: Routes = [
  {
    path: 'weather-forecast',
    component: WeatherForecast,
  },
];
