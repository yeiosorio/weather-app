import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs';
import { WeatherService } from '../../../../core/services/weather.service';
import { StorageService } from '../../../../core/services/storage.service';
import { LocationSuggestion } from '../../../../shared/interfaces/weather.interface';

@Component({
  selector: 'app-weather-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weather-search.component.html',
  styleUrls: ['./weather-search.component.scss'],
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
