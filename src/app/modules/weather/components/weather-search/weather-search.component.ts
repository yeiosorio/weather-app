import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil, switchMap } from 'rxjs/operators';
import { WeatherService } from '../../../../core/services/weather.service';
import { StorageService } from '../../../../core/services/storage.service';
import { LocationSuggestion, WeatherResponse } from '../../../../shared/interfaces/weather.interface';

interface SuggestionItem {
  id: string;
  text: string;
}

@Component({
  selector: 'app-weather-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weather-search.component.html',
  styleUrls: ['./weather-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherSearchComponent implements OnInit, OnDestroy {
  @Output() locationSelected = new EventEmitter<LocationSuggestion>();
  searchControl = new FormControl('');
  suggestions: SuggestionItem[] = [];
  showSuggestions = false;
  loading = false;
  hasError = false;
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((value): value is string => !!value && value.length >= 2),
      switchMap(value => this.weatherService.searchLocations(value))
    ).subscribe({
      next: (locations) => {
        this.suggestions = locations.map(loc => ({
          id: `${loc.name}-${loc.region}-${loc.country}`,
          text: `${loc.name}, ${loc.region}, ${loc.country}`
        }));
        this.loading = false;
        this.showSuggestions = true;
        this.hasError = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.hasError = true;
        setTimeout(() => this.hasError = false, 1000);
        this.loading = false;
        this.showSuggestions = false;
        this.cdr.markForCheck();
      }
    });
  }

  selectLocation(location: LocationSuggestion): void {
    this.storageService.addToHistory(location);
    this.searchControl.setValue('', { emitEvent: false });
    this.suggestions = [];
    this.showSuggestions = false;
    this.locationSelected.emit(location);
    this.cdr.markForCheck();
  }

  onBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
      this.cdr.markForCheck();
    }, 200);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchCity(): void {
    const city = this.searchControl.value;
    if (city) {
      this.weatherService.getCurrentWeather(city).subscribe({
        next: (data: WeatherResponse) => {
          const location: LocationSuggestion = {
            id: `${data.location.name}-${data.location.region}-${data.location.country}`,
            name: data.location.name,
            region: data.location.region,
            country: data.location.country
          };
          this.locationSelected.emit(location);
          this.suggestions = [];
          this.showSuggestions = false;
          this.searchControl.setValue('');
          this.cdr.markForCheck();
        },
        error: () => {
          this.hasError = true;
          setTimeout(() => this.hasError = false, 1000);
        }
      });
    }
  }

  selectCity(suggestion: SuggestionItem): void {
    const cityName = suggestion.text.split(',')[0];
    /* this.searchControl.setValue(cityName); */
    this.searchCity();
  }
}
