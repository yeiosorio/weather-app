import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../../../core/services/storage.service';
import { WeatherService } from '../../../../core/services/weather.service';
import { StoredLocation } from '../../../../shared/interfaces/weather.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesListComponent implements OnInit {
  favorites: StoredLocation[] = [];
  displayedFavorites: StoredLocation[] = [];
  private pageSize = 5;
  private currentPage = 1;
  hasMoreItems = false;

  constructor(
    private storageService: StorageService,
    private weatherService: WeatherService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  /* carga inicial favoritos almacenados en localStorage */
  private loadFavorites(): void {
    this.favorites = this.storageService.getFavorites();
    this.updateWeatherInfo();
  }

  private updateWeatherInfo(): void {
    if (this.favorites.length === 0) return;

    const weatherRequests = this.favorites.map(favorite => {
      const query = `${favorite.name}, ${favorite.region}, ${favorite.country}`.trim();
      return this.weatherService.getCurrentWeather(query);
    });

    forkJoin(weatherRequests).subscribe({
      next: (responses) => {
        this.favorites = this.favorites.map((favorite, index) => ({
          ...favorite,
          weather: {
            temp_c: responses[index].current.temp_c,
            condition: {
              text: responses[index].current.condition.text,
              icon: responses[index].current.condition.icon
            },
            localtime: responses[index].location.localtime
          }
        }));
        
        // Actualizar los favoritos en el storage con la nueva información
        this.favorites.forEach(favorite => {
          this.storageService.updateFavorite(favorite);
        });
        
        this.loadMoreItems();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error updating weather info:', error);
        this.loadMoreItems();
      }
    });
  }

  loadMoreItems(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newItems = this.favorites.slice(startIndex, endIndex);
    
    this.displayedFavorites = [...this.displayedFavorites, ...newItems];
    this.hasMoreItems = endIndex < this.favorites.length;
    this.currentPage++;
    this.cdr.markForCheck();
  }

  removeFromFavorites(id: string): void {
    this.storageService.removeFromFavorites(id);
    this.favorites = this.storageService.getFavorites();
    this.displayedFavorites = this.favorites.slice(0, this.pageSize * (this.currentPage - 1));
    this.hasMoreItems = this.displayedFavorites.length < this.favorites.length;
    this.cdr.markForCheck();
  }

  searchWeather(location: StoredLocation): void {
    this.router.navigate(['/'], { 
      state: { searchLocation: location.name }
    });
  }

  trackByFn(index: number, item: StoredLocation): string {
    return item.id;
  }
}
