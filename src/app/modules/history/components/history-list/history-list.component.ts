import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../../../core/services/storage.service';
import { StoredLocation } from '../../../../shared/interfaces/weather.interface';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryListComponent implements OnInit {
  history: StoredLocation[] = [];
  displayedHistory: StoredLocation[] = [];
  private pageSize = 6;
  private currentPage = 1;
  hasMoreItems = false;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  private loadHistory(): void {
    this.history = this.storageService.getHistory();
    this.loadMoreItems();
  }

  loadMoreItems(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newItems = this.history.slice(startIndex, endIndex);
    
    this.displayedHistory = [...this.displayedHistory, ...newItems];
    this.hasMoreItems = endIndex < this.history.length;
    this.currentPage++;
    this.cdr.markForCheck();
  }

  clearHistory(): void {
    this.storageService.clearHistory();
    this.history = [];
    this.displayedHistory = [];
    this.hasMoreItems = false;
    this.currentPage = 1;
    this.cdr.markForCheck();
  }

  searchAgain(location: StoredLocation): void {
    this.router.navigate(['/'], { 
      state: { searchLocation: location.name }
    });
  }

  trackByFn(index: number, item: StoredLocation): number {
    return item.id;
  }
}
