import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService, StoredLocation } from '../../../../core/services/storage.service';
import { WeatherService } from '../../../../core/services/weather.service';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="history-container">
      <div class="history-header">
        <h2>Historial de Búsquedas</h2>
        @if (history.length > 0) {
          <button
            class="clear-button"
            (click)="clearHistory()"
          >
            Limpiar Historial
          </button>
        }
      </div>

      @if (history.length > 0) {
        <div class="history-list">
          @for (item of history; track item.id) {
            <div class="history-item">
              <div class="history-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.region }}, {{ item.country }}</p>
                <small>{{ item.timestamp | date:'medium' }}</small>
              </div>
              <div class="history-actions">
                <button
                  class="search-again-button"
                  (click)="searchAgain(item)"
                >
                  Buscar de nuevo
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="no-history">
          <p>No hay búsquedas recientes.</p>
          <p>Las búsquedas que realices aparecerán aquí.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .history-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .history-header h2 {
      margin: 0;
    }

    .clear-button {
      padding: 8px 16px;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .clear-button:hover {
      background-color: #d32f2f;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .history-item {
      background: white;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .history-info h3 {
      margin: 0;
      color: #333;
    }

    .history-info p {
      margin: 4px 0;
      color: #666;
    }

    .history-info small {
      color: #888;
      font-size: 12px;
    }

    .search-again-button {
      padding: 8px 16px;
      background-color: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .search-again-button:hover {
      background-color: #1976d2;
    }

    .no-history {
      text-align: center;
      padding: 48px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .no-history p {
      margin: 0;
      color: #666;
    }

    .no-history p:first-child {
      font-size: 18px;
      margin-bottom: 8px;
    }

    @media (max-width: 768px) {
      .history-item {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .history-actions {
        width: 100%;
      }

      .search-again-button {
        width: 100%;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryListComponent implements OnInit {
  history: StoredLocation[] = [];

  constructor(
    private storageService: StorageService,
    private weatherService: WeatherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.history = this.storageService.getHistory();
  }

  clearHistory(): void {
    this.storageService.clearHistory();
    this.history = [];
  }

  searchAgain(location: StoredLocation): void {
    this.router.navigate(['/'], { 
      state: { searchLocation: location.name }
    });
  }
}
