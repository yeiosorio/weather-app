import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherDetailComponent } from './weather-detail.component';
import { StorageService } from '../../../../core/services/storage.service';
import { WeatherResponse, StoredLocation } from '../../../../shared/interfaces/weather.interface';

describe('WeatherDetailComponent', () => {
  let component: WeatherDetailComponent;
  let fixture: ComponentFixture<WeatherDetailComponent>;
  let storageService: jasmine.SpyObj<StorageService>;

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

  const mockStoredLocation: StoredLocation = {
    id: '1',
    name: 'Madrid',
    region: 'Madrid',
    country: 'Spain'
  };

  beforeEach(async () => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['getFavorites', 'addToFavorites', 'removeFromFavorites']);
    
    await TestBed.configureTestingModule({
      declarations: [ WeatherDetailComponent ],
      providers: [
        { provide: StorageService, useValue: storageSpy }
      ]
    }).compileComponents();

    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherDetailComponent);
    component = fixture.componentInstance;
    component.weatherData = mockWeatherData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display weather data correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Madrid');
    expect(compiled.querySelector('.temp-value')?.textContent).toContain('25');
    expect(compiled.querySelector('.condition-text')?.textContent).toContain('Sunny');
  });

});
