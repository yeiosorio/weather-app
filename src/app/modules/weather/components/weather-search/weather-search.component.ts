import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs';
import { WeatherService, LocationSuggestion } from '../../../../core/services/weather.service';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-weather-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="search-container">
      <div class="search-box">
        <input
          type="text"
          [formControl]="searchControl"
          placeholder="Buscar ciudad..."
          class="search-input"
          (focus)="showSuggestions = true"
        />
        @if (loading) {
          <div class="loading-indicator"></div>
        }
      </div>

      @if (showSuggestions && suggestions.length > 0) {
        <ul class="suggestions-list">
          @for (suggestion of suggestions; track suggestion.id) {
            <li
              class="suggestion-item"
              (click)="selectLocation(suggestion)"
            >
              {{ suggestion.name }}, {{ suggestion.region }}, {{ suggestion.country }}
            </li>
          }
        </ul>
      }

      @if (error) {
        <div class="error-message">
          {{ error }}
        </div>
      }
    </div>
  `,
  styles: [`
    .search-container {
      position: relative;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }

    .search-box {
      position: relative;
      width: 100%;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px;
      font-size: 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      border-color: #2196f3;
    }

    .loading-indicator {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #2196f3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .suggestions-list {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
      margin-top: 4px;
    }

    .suggestion-item {
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .suggestion-item:hover {
      background-color: #f5f5f5;
    }

    .error-message {
      color: #f44336;
      margin-top: 8px;
      font-size: 14px;
    }

    @keyframes spin {
      0% { transform: translateY(-50%) rotate(0deg); }
      100% { transform: translateY(-50%) rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherSearchComponent implements OnInit, OnDestroy {
  @Output() locationSelected = new EventEmitter<string>();
  searchControl = new FormControl('');
  suggestions: LocationSuggestion[] = [];
  showSuggestions = false;
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(query => !!query && query.length >= 2),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.loading = true;
      this.error = null;
      
      this.weatherService.searchLocations(query!).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (results) => {
          this.suggestions = results;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al buscar ubicaciones. Por favor, intente nuevamente.';
          this.loading = false;
          console.error('Error searching locations:', error);
        }
      });
    });
  }

  selectLocation(location: LocationSuggestion): void {
    this.storageService.addToHistory(location);
    this.searchControl.setValue('');
    this.suggestions = [];
    this.showSuggestions = false;
    this.locationSelected.emit(location.name);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
