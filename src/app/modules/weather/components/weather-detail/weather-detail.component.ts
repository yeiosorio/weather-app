import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherResponse } from '../../../../shared/interfaces/weather.interface';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-weather-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-detail.component.html',
  styleUrls: ['./weather-detail.component.scss'],
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
      id: Date.now().toString(),
      name: this.weatherData.location.name,
      region: this.weatherData.location.region,
      country: this.weatherData.location.country,
      timestamp: Date.now(),
      weather: {
        temp_c: this.weatherData.current.temp_c,
        condition: {
          text: this.weatherData.current.condition.text,
          icon: this.weatherData.current.condition.icon
        },
        localtime: this.weatherData.location.localtime
      }
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
