import {TestBed} from '@angular/core/testing';

import {WeatherForecastService} from './weather-forecast.service';

describe('WeatherForecast', () => {
  let service: WeatherForecastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherForecastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
