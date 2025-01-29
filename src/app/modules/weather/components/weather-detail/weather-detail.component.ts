import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherResponse } from '../../../../core/services/weather.service';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-weather-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (weatherData) {
      <div class="weather-card">
        <div class="location-info">
          <h2>{{ weatherData.location.name }}</h2>
          <p class="location-detail">
            {{ weatherData.location.region }}, {{ weatherData.location.country }}
          </p>
          <p class="local-time">
            {{ weatherData.location.localtime | date:'medium' }}
          </p>
          <button
            class="favorite-button"
            (click)="toggleFavorite()"
            [class.is-favorite]="isFavorite"
          >
            {{ isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
          </button>
        </div>

        <div class="weather-info">
          <div class="temperature-container">
            <div class="temperature">
              <span class="temp-value">{{ weatherData.current.temp_c }}</span>
              <span class="temp-unit">°C</span>
            </div>
            <div class="temperature fahrenheit">
              <span class="temp-value">{{ weatherData.current.temp_f }}</span>
              <span class="temp-unit">°F</span>
            </div>
          </div>

          <div class="condition">
            <img
              [src]="weatherData.current.condition.icon"
              [alt]="weatherData.current.condition.text"
              class="condition-icon"
            />
            <p class="condition-text">
              {{ weatherData.current.condition.text }}
            </p>
          </div>

          <div class="additional-info">
            <div class="info-item">
              <span class="info-label">Viento</span>
              <span class="info-value">{{ weatherData.current.wind_kph }} km/h</span>
            </div>
            <div class="info-item">
              <span class="info-label">Humedad</span>
              <span class="info-value">{{ weatherData.current.humidity }}%</span>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="no-data">
        <p>Selecciona una ciudad para ver el clima actual</p>
      </div>
    }
  `,
  styles: [`
    .weather-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      margin: 20px auto;
    }

    .location-info {
      text-align: center;
      margin-bottom: 24px;
    }

    h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }

    .location-detail {
      color: #666;
      margin: 4px 0;
    }

    .local-time {
      color: #888;
      font-size: 14px;
    }

    .weather-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .temperature-container {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .temperature {
      display: flex;
      align-items: baseline;
    }

    .temp-value {
      font-size: 48px;
      font-weight: bold;
      color: #333;
    }

    .temp-unit {
      font-size: 24px;
      color: #666;
      margin-left: 4px;
    }

    .fahrenheit {
      color: #666;
      font-size: 24px;
    }

    .condition {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .condition-icon {
      width: 64px;
      height: 64px;
    }

    .condition-text {
      color: #444;
      font-size: 18px;
      margin: 0;
    }

    .additional-info {
      display: flex;
      gap: 32px;
      width: 100%;
      justify-content: center;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .info-label {
      color: #666;
      font-size: 14px;
    }

    .info-value {
      color: #333;
      font-weight: 500;
    }

    .no-data {
      text-align: center;
      color: #666;
      padding: 48px;
      background: #f5f5f5;
      border-radius: 12px;
      margin: 20px auto;
      max-width: 500px;
    }

    .favorite-button {
      margin-top: 12px;
      padding: 8px 16px;
      background-color: transparent;
      border: 2px solid #2196f3;
      color: #2196f3;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .favorite-button:hover {
      background-color: #e3f2fd;
    }

    .favorite-button.is-favorite {
      background-color: #2196f3;
      color: white;
    }

    .favorite-button.is-favorite:hover {
      background-color: #1976d2;
      border-color: #1976d2;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherDetailComponent {
  @Input() set weatherData(value: WeatherResponse | null) {
    this._weatherData = value;
    if (value) {
      this.checkIfFavorite();
    }
  }
  get weatherData(): WeatherResponse | null {
    return this._weatherData;
  }

  private _weatherData: WeatherResponse | null = null;
  isFavorite = false;

  constructor(private storageService: StorageService) {}

  private checkIfFavorite(): void {
    if (this.weatherData) {
      const favorites = this.storageService.getFavorites();
      this.isFavorite = favorites.some(fav => 
        fav.name === this.weatherData?.location.name &&
        fav.country === this.weatherData?.location.country
      );
    }
  }

  toggleFavorite(): void {
    if (!this.weatherData) return;

    const location = {
      id: Date.now(), // Generamos un ID único basado en el timestamp
      name: this.weatherData.location.name,
      region: this.weatherData.location.region,
      country: this.weatherData.location.country
    };

    if (this.isFavorite) {
      const favorites = this.storageService.getFavorites();
      const favorite = favorites.find(fav => 
        fav.name === location.name && 
        fav.country === location.country
      );
      if (favorite) {
        this.storageService.removeFromFavorites(favorite.id);
      }
    } else {
      this.storageService.addToFavorites(location);
    }

    this.isFavorite = !this.isFavorite;
  }
}
