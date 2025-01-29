import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService, StoredLocation } from '../../../../core/services/storage.service';
import { WeatherService } from '../../../../core/services/weather.service';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="favorites-container">
      @if (favorites.length > 0) {
        <div class="favorites-grid">
          @for (favorite of favorites; track favorite.id) {
            <div class="favorite-card">
              <div class="favorite-info">
                <h3>{{ favorite.name }}</h3>
                <p>{{ favorite.region }}, {{ favorite.country }}</p>
              </div>
              <div class="favorite-actions">
                <button
                  class="remove-button"
                  (click)="removeFavorite(favorite.id)"
                >
                  Eliminar
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="no-favorites">
          <p>No tienes ciudades favoritas guardadas.</p>
          <p>Agrega ciudades desde la búsqueda del clima.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .favorites-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .favorite-card {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .favorite-info h3 {
      margin: 0;
      color: #333;
    }

    .favorite-info p {
      margin: 4px 0 0;
      color: #666;
      font-size: 14px;
    }

    .remove-button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background-color: #f44336;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .remove-button:hover {
      background-color: #d32f2f;
    }

    .no-favorites {
      text-align: center;
      padding: 48px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .no-favorites p {
      margin: 0;
      color: #666;
    }

    .no-favorites p:first-child {
      font-size: 18px;
      margin-bottom: 8px;
    }

    @media (max-width: 768px) {
      .favorites-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesListComponent implements OnInit {
  favorites: StoredLocation[] = [];

  constructor(
    private storageService: StorageService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.favorites = this.storageService.getFavorites();
  }

  removeFavorite(id: number): void {
    this.storageService.removeFromFavorites(id);
    this.favorites = this.storageService.getFavorites();
  }
}
