import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar animate-slide-in-left">
      <div class="sidebar-header">
        <div class="logo animate-fade-in stagger-1" style="animation-name: floatY; animation-duration: 6s; animation-iteration-count: infinite;">
          <i class="fa-solid fa-spa"></i>
        </div>
        <h2>Luxe Salon</h2>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/app/calendar" routerLinkActive="active" class="nav-item animate-fade-in stagger-1">
          <i class="fa-regular fa-calendar-alt"></i>
          <span>Calendar</span>
        </a>
        <a routerLink="/app/appointments" routerLinkActive="active" class="nav-item animate-fade-in stagger-2">
          <i class="fa-solid fa-clipboard-list"></i>
          <span>Appointments</span>
        </a>
        <a routerLink="/app/staff" routerLinkActive="active" class="nav-item animate-fade-in stagger-3">
          <i class="fa-solid fa-users"></i>
          <span>Staff</span>
        </a>
        <a routerLink="/app/clients" routerLinkActive="active" class="nav-item animate-fade-in stagger-4">
          <i class="fa-regular fa-address-book"></i>
          <span>Clients</span>
        </a>
        <a routerLink="/app/billing" routerLinkActive="active" class="nav-item animate-fade-in stagger-5">
          <i class="fa-solid fa-file-invoice-dollar"></i>
          <span>Billing</span>
        </a>
        <a routerLink="/app/settings" routerLinkActive="active" class="nav-item animate-fade-in" style="animation-delay: 0.6s; opacity: 0;">
          <i class="fa-solid fa-gear"></i>
          <span>Settings</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn animate-fade-in" style="animation-delay: 0.7s; opacity: 0;" (click)="logout()">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background-color: var(--color-bg-sidebar);
      color: var(--color-text-inverse);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-lg);
    }
    .sidebar-header {
      padding: 2rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .logo {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, var(--color-secondary) 0%, #D8BEA3 100%);
      color: var(--color-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 4px 10px rgba(196, 164, 132, 0.3);
    }
    .sidebar-header h2 {
      color: var(--color-text-inverse);
      margin: 0;
      font-size: 1.25rem;
      letter-spacing: 0.5px;
    }
    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1rem;
      border-radius: var(--radius-md);
      color: var(--color-text-inverse-muted);
      font-weight: 500;
      transition: all var(--transition-fast);
    }
    .nav-item i {
      width: 20px;
      text-align: center;
      font-size: 1.1rem;
    }
    .nav-item:hover, .nav-item.active {
      background-color: rgba(255,255,255,0.1);
      color: var(--color-secondary);
    }
    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1rem;
      color: var(--color-text-inverse-muted);
      border-radius: var(--radius-md);
    }
    .logout-btn:hover {
      background-color: rgba(255,255,255,0.1);
      color: var(--color-text-inverse);
    }
  `]
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
