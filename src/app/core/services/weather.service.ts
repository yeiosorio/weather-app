import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WeatherResponse {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
  };
}

export interface LocationSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly API_URL = 'http://api.weatherapi.com/v1';
  private readonly CACHE_SIZE = 1;
  private cache = new Map<string, Observable<WeatherResponse>>();

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<WeatherResponse> {
    const cacheKey = `weather_${city}`;
    
    if (!this.cache.has(cacheKey)) {
      const params = new HttpParams()
        .set('key', environment.weatherApiKey)
        .set('q', city)
        .set('aqi', 'no');

      const request = this.http.get<WeatherResponse>(`${this.API_URL}/current.json`, { params })
        .pipe(
          shareReplay(this.CACHE_SIZE)
        );

      this.cache.set(cacheKey, request);
    }

    return this.cache.get(cacheKey)!;
  }

  searchLocations(query: string): Observable<LocationSuggestion[]> {
    if (!query.trim()) {
      return new Observable(subscriber => subscriber.next([]));
    }

    const params = new HttpParams()
      .set('key', environment.weatherApiKey)
      .set('q', query);

    return this.http.get<LocationSuggestion[]>(`${this.API_URL}/search.json`, { params });
  }
} 