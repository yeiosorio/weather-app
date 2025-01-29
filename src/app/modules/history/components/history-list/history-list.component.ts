import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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

  constructor(
    private storageService: StorageService,
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
