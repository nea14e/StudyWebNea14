import {Routes} from '@angular/router';
import {WeatherForecastComponent} from './weather-forecast/weather-forecast.component';
import {CrudExampleComponent} from './crud-example/crud-example.component';
import {
  CrudExampleDetailsComponent
} from './crud-example/crud-example-details.component/crud-example-details.component';
import {TableOfContentsComponent} from './table-of-contents.component/table-of-contents.component';

export const routes: Routes = [
  {
    path: 'table-of-contents',
    component: TableOfContentsComponent
  },
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
  {
    path: '**',
    component: TableOfContentsComponent,
  }
];
