import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { environment } from '../../../environments/environment';
import { WeatherResponse } from '../../../app/shared/interfaces/weather.interface';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch weather data for a city', () => {
    const mockWeatherData: WeatherResponse = {
      location: {
        name: 'Madrid',
        region: 'Madrid',
        country: 'Spain',
        localtime: '2024-03-20 12:00'
      },
      current: {
        temp_c: 25,
        temp_f: 77,
        condition: {
          text: 'Sunny',
          icon: 'sun.png',
          code: 1000
        },
        wind_kph: 15,
        humidity: 45,
        feelslike_c: 26
      }
    };

    service.getCurrentWeather('Madrid').subscribe(data => {
      expect(data).toEqual(mockWeatherData);
    });

    const req = httpMock.expectOne(
        'http://api.weatherapi.com/v1/current.json?key=${environment.weatherApiKey}&q=Madrid'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockWeatherData);
  });

  it('should handle error when API fails', () => {
    service.getCurrentWeather('InvalidCity').subscribe({
      error: (error: { status: number }) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(
        'http://api.weatherapi.com/v1/current.json?key=${environment.weatherApiKey}&q=InvalidCity'
    );
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
}); 