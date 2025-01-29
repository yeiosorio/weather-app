import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <nav class="main-nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          Clima
        </a>
        <a routerLink="/favorites" routerLinkActive="active">
          Favoritos
        </a>
        <a routerLink="/history" routerLinkActive="active">
          Historial
        </a>
      </nav>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .main-nav {
      background: white;
      padding: 16px;
      display: flex;
      justify-content: center;
      gap: 24px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .main-nav a {
      text-decoration: none;
      color: #666;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .main-nav a:hover {
      color: #2196f3;
      background: #f5f5f5;
    }

    .main-nav a.active {
      color: #2196f3;
      background: #e3f2fd;
    }

    main {
      padding: 24px;
    }
  `]
})
export class AppComponent {
  title = 'Weather App';
}
