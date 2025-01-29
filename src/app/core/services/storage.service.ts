import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoredLocation } from '../../shared/interfaces/weather.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly FAVORITES_KEY = 'favorites';
  private readonly HISTORY_KEY = 'search_history';
  private readonly MAX_HISTORY_ITEMS = 20;

  private favoritesSubject = new BehaviorSubject<StoredLocation[]>(this.getFavorites());
  private historySubject = new BehaviorSubject<StoredLocation[]>(this.getHistory());

  favorites$ = this.favoritesSubject.asObservable();
  history$ = this.historySubject.asObservable();

  constructor() {}

  // Métodos para favoritos
  getFavorites(): StoredLocation[] {
    const favoritesJson = localStorage.getItem(this.FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  }

  addToFavorites(location: StoredLocation): void {
    const favorites = this.getFavorites();
    favorites.unshift(location);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  removeFromFavorites(id: string): void {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(item => item.id !== id);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(updatedFavorites));
    this.favoritesSubject.next(updatedFavorites);
  }

  updateFavorite(location: StoredLocation): void {
    const favorites = this.getFavorites();
    const index = favorites.findIndex(fav => fav.id === location.id);
    if (index !== -1) {
      favorites[index] = location;
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
      this.favoritesSubject.next(favorites);
    }
  }

  // Métodos para historial
  getHistory(): StoredLocation[] {
    const historyJson = localStorage.getItem(this.HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  }

  addToHistory(location: StoredLocation): void {
    const history = this.getHistory();
    
    // Remover entrada existente si la hay
    const filteredHistory = history.filter(item => 
      item.name !== location.name || 
      item.country !== location.country
    );
    
    // Agregar nueva entrada al inicio
    filteredHistory.unshift(location);
    
    // Mantener solo los últimos MAX_HISTORY_ITEMS
    const trimmedHistory = filteredHistory.slice(0, this.MAX_HISTORY_ITEMS);
    
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(trimmedHistory));
    this.historySubject.next(trimmedHistory);
  }

  clearHistory(): void {
    localStorage.removeItem(this.HISTORY_KEY);
    this.historySubject.next([]);
  }
} 