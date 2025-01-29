import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service';
import { StoredLocation } from '../../../../shared/interfaces/weather.interface';

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

  constructor(
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.favorites = this.storageService.getFavorites();
  }

  removeFavorite(id: number): void {
    this.storageService.removeFromFavorites(id);
    this.favorites = this.storageService.getFavorites();
  }
}
