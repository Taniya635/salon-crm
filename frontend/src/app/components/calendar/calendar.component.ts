import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Staff, Appointment, ServiceItem } from '../../models/types';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="calendar-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Appointments Calendar</h1>
          <p class="page-subtitle">View and manage daily bookings</p>
        </div>
        <div class="date-picker-wrapper">
          <label for="datePicker">Date:</label>
          <input type="date" id="datePicker" [(ngModel)]="selectedDate" (ngModelChange)="onDateChange()" class="date-input" />
        </div>
      </div>

      <div class="card calendar-card animate-slide-up">
        <div class="table-container">
          <table class="custom-table calendar-table">
            <thead>
              <tr>
                <th class="time-col">Time</th>
                <th *ngFor="let s of staff" class="staff-col">
                  <div class="staff-header">
                    <img [src]="s.avatar" [alt]="s.name" class="staff-avatar" />
                    <div>
                      <div class="staff-name">{{s.name}}</div>
                      <div class="staff-role">{{s.role}}</div>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let time of timeSlots; let i = index" class="animate-fade-in" [style.animation-delay]="i * 0.05 + 's'">
                <td class="time-cell">{{ time }}</td>
                <td *ngFor="let s of staff" class="slot-cell">
                  <ng-container *ngIf="getAppointment(s.id, time) as appt; else emptySlot">
                    <div class="slot booked animate-scale-in" (click)="viewAppointment(appt.id)">
                      <div class="client-name">{{ appt.clientName }}</div>
                      <div class="service-name">{{ getServiceName(appt.serviceId) }}</div>
                    </div>
                  </ng-container>
                  <ng-template #emptySlot>
                    <div class="slot available" (click)="bookSlot(s.id, time)">
                      <i class="fa-solid fa-plus"></i>
                      <span>Available</span>
                    </div>
                  </ng-template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 1.875rem;
      margin-bottom: 0.25rem;
    }
    .page-subtitle {
      color: var(--color-text-muted);
    }
    .date-picker-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .date-input {
      padding: 0.5rem 1rem;
      width: auto;
    }
    .calendar-card {
      padding: 0;
    }
    .calendar-table th, .calendar-table td {
      border: 1px solid var(--color-border);
    }
    .calendar-table th {
      background-color: var(--color-bg-body);
    }
    .time-col {
      width: 100px;
      text-align: center !important;
    }
    .staff-col {
      min-width: 200px;
    }
    .staff-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .staff-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    .staff-name {
      font-weight: 600;
      color: var(--color-text-main);
      text-transform: none;
      font-size: 0.875rem;
    }
    .staff-role {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      text-transform: capitalize;
    }
    .time-cell {
      text-align: center !important;
      font-weight: 500;
      color: var(--color-text-muted);
    }
    .slot-cell {
      padding: 0.5rem !important;
      vertical-align: top;
    }
    .slot {
      height: 80px;
      border-radius: var(--radius-sm);
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .slot.booked {
      background: linear-gradient(135deg, rgba(196, 164, 132, 0.15) 0%, rgba(196, 164, 132, 0.25) 100%);
      border-left: 4px solid var(--color-secondary);
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .slot.booked:hover {
      background: linear-gradient(135deg, rgba(196, 164, 132, 0.25) 0%, rgba(196, 164, 132, 0.35) 100%);
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 4px 12px rgba(196, 164, 132, 0.2);
    }
    .slot.available {
      background-color: transparent;
      border: 1px dashed rgba(229, 231, 235, 0.8);
      color: var(--color-text-muted);
      align-items: center;
      gap: 0.5rem;
    }
    .slot.available:hover {
      background-color: rgba(249, 250, 251, 0.8);
      border-color: var(--color-secondary);
      color: var(--color-secondary);
      animation: pulseGlow 1.5s infinite;
    }
    .client-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--color-text-main);
    }
    .service-name {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin-top: 0.25rem;
    }
  `]
})
export class CalendarComponent implements OnInit {
  selectedDate: string;
  timeSlots: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  staff: Staff[] = [];
  appointments: Appointment[] = [];
  services: ServiceItem[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    this.selectedDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.dataService.staff$.subscribe(staff => this.staff = staff);
    this.dataService.services$.subscribe(services => this.services = services);
    this.dataService.appointments$.subscribe((appts: Appointment[]) => {
      this.appointments = appts.filter(a => a.date === this.selectedDate && a.status !== 'cancelled');
    });
  }

  onDateChange() {
    this.dataService.appointments$.subscribe((appts: Appointment[]) => {
      this.appointments = appts.filter(a => a.date === this.selectedDate && a.status !== 'cancelled');
    }).unsubscribe(); // just fetching the current state
  }

  getAppointment(staffId: string, time: string): Appointment | undefined {
    return this.appointments.find(a => a.staffId === staffId && a.time === time);
  }

  getServiceName(serviceId: string): string {
    return this.services.find(s => s.id === serviceId)?.name || 'Unknown Service';
  }

  bookSlot(staffId: string, time: string) {
    this.router.navigate(['/app/appointments/book'], {
      queryParams: { date: this.selectedDate, staffId, time }
    });
  }

  viewAppointment(id: string) {
    this.router.navigate(['/app/appointments', id, 'manage']);
  }
}
