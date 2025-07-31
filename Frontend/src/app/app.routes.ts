import {Routes} from '@angular/router';
import {WeatherForecastComponent} from './weather-forecast/weather-forecast.component';
import {CrudExampleComponent} from './crud-example/crud-example.component';
import {
  CrudExampleDetailsComponent
} from './crud-example/crud-example-details.component/crud-example-details.component';

export const routes: Routes = [
  {
    path: 'weather-forecast',
    component: WeatherForecastComponent,
  },
  {
    path: 'crud-example',
    children: [
      {
        path: '',
        component: CrudExampleComponent,
      },
      {
        path: 'edit/:id',
        component: CrudExampleDetailsComponent,
      },
      {
        path: 'create',
        component: CrudExampleDetailsComponent,
      }
    ]
  },
];
