import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WeatherSearchComponent } from './components/weather-search/weather-search.component';
import { WeatherDetailComponent } from './components/weather-detail/weather-detail.component';
import { WeatherService } from '../../core/services/weather.service';
import { WeatherResponse, LocationSuggestion } from '../../shared/interfaces/weather.interface';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, WeatherSearchComponent, WeatherDetailComponent],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherComponent implements OnInit {
  currentWeather: WeatherResponse | null = null;
  error: string | null = null;

  constructor(
    private weatherService: WeatherService,
    private storageService: StorageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['searchLocation']) {
      const location = navigation.extras.state['searchLocation'];
      this.onLocationSelected({
        id: Date.now(),
        name: location,
        region: '',
        country: ''
      });
    }
  }

  ngOnInit(): void {
    // Si hay historial, cargar la última búsqueda
    const history = this.storageService.getHistory();
    if (history.length > 0 && !this.currentWeather) {
      this.onLocationSelected(history[0]);
    }
  }

  onLocationSelected(location: LocationSuggestion): void {
    this.error = null;
    this.cdr.markForCheck();
    
    const query = `${location.name}, ${location.region}, ${location.country}`.trim();
    this.weatherService.getCurrentWeather(query).subscribe({
      next: (weather) => {
        this.currentWeather = weather;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching weather:', error);
        this.error = 'Error al obtener el clima. Por favor, intente nuevamente.';
        this.cdr.markForCheck();
      }
    });
  }
} 