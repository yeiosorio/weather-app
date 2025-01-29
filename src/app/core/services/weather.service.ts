import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WeatherResponse, LocationSuggestion } from '../../shared/interfaces/weather.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly API_URL = 'http://api.weatherapi.com/v1';
  private readonly CACHE_SIZE = 1; // Se establece la constante de CACHE solo a un buffer size
  private cache = new Map<string, Observable<WeatherResponse>>();

  constructor(private http: HttpClient) { }

  /* 
    @arg city
    @desc Recupera datos del clima por nombre de ciudad en el endpoint current.json
    @return retorna un observable con el response de tipo WeatherResponse
  */
  getCurrentWeather(city: string): Observable<WeatherResponse> {
    const cacheKey = `weather_${city}`;

    // Se verifica si no ha sido buscada la ciudad
    if (!this.cache.has(cacheKey)) {
      const params = new HttpParams()
        .set('key', environment.weatherApiKey)
        .set('q', city)
        .set('aqi', 'no');

      const request = this.http.get<WeatherResponse>(`${this.API_URL}/current.json`, { params })
        .pipe(
          shareReplay(this.CACHE_SIZE)
        );

      // Se establece una key y la respuesta en el objeto Map de chache para
      // que no vuelva a ser llamado si ya existe
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