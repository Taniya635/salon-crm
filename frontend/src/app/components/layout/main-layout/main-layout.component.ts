import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--color-bg-body);
    }
    .main-content {
      flex: 1;
      margin-left: 260px; /* match sidebar width */
      display: flex;
      flex-direction: column;
    }
    .content-wrapper {
      padding: 2rem;
      flex: 1;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      animation: fadeIn var(--transition-normal);
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class MainLayoutComponent {}
