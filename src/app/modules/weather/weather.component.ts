import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WeatherSearchComponent } from './components/weather-search/weather-search.component';
import { WeatherDetailComponent } from './components/weather-detail/weather-detail.component';
import { WeatherService, WeatherResponse } from '../../core/services/weather.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, WeatherSearchComponent, WeatherDetailComponent],
  template: `
    <div class="weather-container">
      <h1>Clima Actual</h1>
      
      <app-weather-search
        (locationSelected)="onLocationSelected($event)"
      ></app-weather-search>

      @if (error) {
        <div class="error-message">
          {{ error }}
        </div>
      }

      <app-weather-detail
        [weatherData]="currentWeather"
      ></app-weather-detail>
    </div>
  `,
  styles: [`
    .weather-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 32px;
    }

    .error-message {
      color: #f44336;
      text-align: center;
      padding: 12px;
      margin: 12px 0;
      background-color: #ffebee;
      border-radius: 4px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherComponent implements OnInit {
  currentWeather: WeatherResponse | null = null;
  error: string | null = null;

  constructor(
    private weatherService: WeatherService,
    private storageService: StorageService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['searchLocation']) {
      this.onLocationSelected(navigation.extras.state['searchLocation']);
    }
  }

  ngOnInit(): void {
    // Si hay historial, cargar la última búsqueda
    const history = this.storageService.getHistory();
    if (history.length > 0 && !this.currentWeather) {
      this.onLocationSelected(history[0].name);
    }
  }

  onLocationSelected(location: string): void {
    this.error = null;
    this.weatherService.getCurrentWeather(location).subscribe({
      next: (weather) => {
        this.currentWeather = weather;
      },
      error: (error) => {
        console.error('Error fetching weather:', error);
        this.error = 'Error al obtener el clima. Por favor, intente nuevamente.';
      }
    });
  }
} 