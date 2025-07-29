import {Routes} from '@angular/router';
import {WeatherForecastComponent} from './weather-forecast/weather-forecast.component';
import {CrudExampleComponent} from './crud-example/crud-example.component';

export const routes: Routes = [
  {
    path: 'weather-forecast',
    component: WeatherForecastComponent,
  },
  {
    path: 'crud-example',
    component: CrudExampleComponent,
  },
];
