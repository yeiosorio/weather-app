import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface StoredLocation {
  id: number;
  name: string;
  region: string;
  country: string;
  timestamp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly FAVORITES_KEY = 'weather_favorites';
  private readonly HISTORY_KEY = 'weather_history';
  private readonly MAX_HISTORY_ITEMS = 10;

  private favoritesSubject = new BehaviorSubject<StoredLocation[]>(this.getFavorites());
  private historySubject = new BehaviorSubject<StoredLocation[]>(this.getHistory());

  favorites$ = this.favoritesSubject.asObservable();
  history$ = this.historySubject.asObservable();

  constructor() {}

  // Métodos para favoritos
  getFavorites(): StoredLocation[] {
    const favorites = localStorage.getItem(this.FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  }

  addToFavorites(location: StoredLocation): void {
    const favorites = this.getFavorites();
    if (!favorites.some(fav => fav.id === location.id)) {
      favorites.push(location);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
      this.favoritesSubject.next(favorites);
    }
  }

  removeFromFavorites(locationId: number): void {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== locationId);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(updatedFavorites));
    this.favoritesSubject.next(updatedFavorites);
  }

  // Métodos para historial
  getHistory(): StoredLocation[] {
    const history = localStorage.getItem(this.HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  }

  addToHistory(location: StoredLocation): void {
    const history = this.getHistory();
    const locationWithTimestamp = { ...location, timestamp: Date.now() };
    
    // Remover entrada existente si la hay
    const updatedHistory = history.filter(item => item.id !== location.id);
    
    // Agregar nueva entrada al inicio
    updatedHistory.unshift(locationWithTimestamp);
    
    // Mantener solo los últimos MAX_HISTORY_ITEMS
    if (updatedHistory.length > this.MAX_HISTORY_ITEMS) {
      updatedHistory.pop();
    }
    
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(updatedHistory));
    this.historySubject.next(updatedHistory);
  }

  clearHistory(): void {
    localStorage.removeItem(this.HISTORY_KEY);
    this.historySubject.next([]);
  }
} 