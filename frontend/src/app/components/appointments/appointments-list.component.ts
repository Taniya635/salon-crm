import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Appointment, ServiceItem, Staff } from '../../models/types';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="appointments-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">All Appointments</h1>
          <p class="page-subtitle">View and manage all client bookings</p>
        </div>
      </div>

      <div class="card animate-slide-up">
        <div class="table-container">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Client</th>
                <th>Service</th>
                <th>Staff</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let appt of appointments; let i = index" class="animate-fade-in" [style.animation-delay]="i * 0.05 + 's'">
                <td>
                  <div class="font-semibold">{{ appt.date | date:'mediumDate' }}</div>
                  <div class="text-muted">{{ appt.time }}</div>
                </td>
                <td>
                  <div class="font-semibold">{{ appt.clientName }}</div>
                  <div class="text-muted">{{ appt.clientPhone }}</div>
                </td>
                <td>{{ getServiceName(appt.serviceId) }}</td>
                <td>{{ getStaffName(appt.staffId) }}</td>
                <td>
                  <span class="status-badge" [ngClass]="appt.status">
                    {{ appt.status | titlecase }}
                  </span>
                </td>
                <td style="text-align: right;">
                  <button class="btn btn-outline btn-sm" (click)="manageAppointment(appt.id)">
                    Manage
                  </button>
                </td>
              </tr>
              <tr *ngIf="appointments.length === 0">
                <td colspan="6" class="text-center empty-state">
                  No appointments found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .appointments-page {
      max-width: 1000px;
      margin: 0 auto;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 1.875rem;
      margin-bottom: 0.25rem;
    }
    .page-subtitle {
      color: var(--color-text-muted);
    }
    .font-semibold {
      font-weight: 600;
    }
    .text-muted {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 99px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .status-badge.booked {
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--color-success);
    }
    .status-badge.cancelled {
      background-color: rgba(239, 68, 68, 0.1);
      color: var(--color-danger);
    }
    .status-badge.completed {
      background-color: rgba(245, 158, 11, 0.1);
      color: var(--color-warning);
    }
    .btn-sm {
      padding: 0.4rem 0.75rem;
      font-size: 0.875rem;
    }
    .empty-state {
      padding: 3rem;
      color: var(--color-text-muted);
    }
    .text-center {
      text-align: center;
    }
  `]
})
export class AppointmentsListComponent implements OnInit {
  appointments: Appointment[] = [];
  services: ServiceItem[] = [];
  staff: Staff[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataService.services$.subscribe(services => this.services = services);
    this.dataService.staff$.subscribe(staff => this.staff = staff);
    
    this.dataService.appointments$.subscribe((appts: Appointment[]) => {
      // Sort by date and time, newest first or upcoming first
      this.appointments = [...appts].sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time).getTime();
        const dateB = new Date(b.date + 'T' + b.time).getTime();
        return dateB - dateA;
      });
    });
  }

  getServiceName(serviceId: string): string {
    return this.services.find(s => s.id === serviceId)?.name || 'Unknown';
  }

  getStaffName(staffId: string): string {
    return this.staff.find(s => s.id === staffId)?.name || 'Unknown';
  }

  manageAppointment(id: string) {
    this.router.navigate(['/app/appointments', id, 'manage']);
  }
}
