import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Staff, ServiceItem } from '../../models/types';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="booking-page">
      <div class="page-header">
        <button class="btn btn-outline back-btn" (click)="goBack()">
          <i class="fa-solid fa-arrow-left"></i> Back
        </button>
        <div>
          <h1 class="page-title">Book Appointment</h1>
          <p class="page-subtitle">Fill in client details to confirm the slot</p>
        </div>
      </div>

      <div class="card booking-card">
        <div class="booking-grid">
          <div class="booking-summary animate-slide-in-left">
            <h3>Appointment Details</h3>
            <div class="summary-item">
              <i class="fa-regular fa-calendar"></i>
              <div>
                <div class="label">Date</div>
                <div class="value">{{ formattedDate }}</div>
              </div>
            </div>
            <div class="summary-item">
              <i class="fa-regular fa-clock"></i>
              <div>
                <div class="label">Time</div>
                <div class="value">{{ time }}</div>
              </div>
            </div>
            <div class="summary-item" *ngIf="selectedStaff">
              <img [src]="selectedStaff.avatar" alt="Staff" class="summary-avatar" />
              <div>
                <div class="label">Staff Professional</div>
                <div class="value">{{ selectedStaff.name }}</div>
              </div>
            </div>
            <div class="summary-total" *ngIf="selectedService">
              <span>Total Price</span>
              <span class="price">\${{ selectedService.price }}</span>
            </div>
          </div>

          <form (ngSubmit)="bookAppointment()" #bookingForm="ngForm" class="booking-form animate-slide-in-right">
            <h3 class="animate-fade-in stagger-1">Client Information</h3>
            
            <div class="form-row animate-fade-in stagger-2">
              <div class="form-group flex-1">
                <label for="clientName">Client Name *</label>
                <input type="text" id="clientName" name="clientName" [(ngModel)]="clientName" required placeholder="John Doe" />
              </div>
              <div class="form-group flex-1">
                <label for="clientPhone">Phone Number *</label>
                <input type="tel" id="clientPhone" name="clientPhone" [(ngModel)]="clientPhone" required placeholder="(555) 000-0000" />
              </div>
            </div>

            <div class="form-group animate-fade-in stagger-3">
              <label for="serviceId">Select Service *</label>
              <select id="serviceId" name="serviceId" [(ngModel)]="serviceId" (change)="onServiceChange()" required>
                <option value="" disabled selected>-- Select a Service --</option>
                <option *ngFor="let srv of services" [value]="srv.id">
                  {{ srv.name }} (\${{ srv.price }} - {{ srv.durationMinutes }} min)
                </option>
              </select>
            </div>

            <div class="form-group animate-fade-in stagger-4">
              <label for="notes">Special Instructions (Optional)</label>
              <textarea id="notes" name="notes" [(ngModel)]="notes" rows="4" placeholder="Any allergies or specific requests?"></textarea>
            </div>

            <div class="form-actions animate-fade-in stagger-5">
              <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="!bookingForm.form.valid">
                Confirm Booking <i class="fa-solid fa-check ml-2"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-page {
      max-width: 900px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .back-btn {
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      background-color: var(--color-bg-card);
    }
    .page-title {
      font-size: 1.875rem;
      margin-bottom: 0.25rem;
    }
    .page-subtitle {
      color: var(--color-text-muted);
    }
    .booking-card {
      padding: 0;
      overflow: hidden;
    }
    .booking-grid {
      display: grid;
      grid-template-columns: 300px 1fr;
    }
    .booking-summary {
      background: linear-gradient(to bottom right, #F8F9FA, #E5E7EB);
      padding: 2.5rem;
      border-right: 1px solid var(--color-border);
    }
    .booking-summary h3 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      color: var(--color-primary);
    }
    .summary-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .summary-item i {
      font-size: 1.25rem;
      color: var(--color-secondary);
      width: 24px;
      text-align: center;
    }
    .summary-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }
    .label {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    .value {
      font-weight: 500;
      color: var(--color-text-main);
    }
    .summary-total {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px dashed var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 1.125rem;
    }
    .summary-total .price {
      color: var(--color-primary);
      font-size: 1.25rem;
    }
    .booking-form {
      padding: 2rem;
    }
    .booking-form h3 {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      color: var(--color-primary);
    }
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .flex-1 {
      flex: 1;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border);
    }
    .ml-2 {
      margin-left: 0.5rem;
    }
  `]
})
export class BookingComponent implements OnInit {
  date: string = '';
  time: string = '';
  staffId: string = '';
  
  clientName: string = '';
  clientPhone: string = '';
  serviceId: string = '';
  notes: string = '';

  staffList: Staff[] = [];
  services: ServiceItem[] = [];
  selectedStaff?: Staff;
  selectedService?: ServiceItem;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.staff$.subscribe(staff => {
      this.staffList = staff;
      if (!this.staffId && staff.length > 0) this.staffId = staff[0].id;
      this.selectedStaff = this.staffList.find(s => s.id === this.staffId || (s as any)._id === this.staffId);
    });
    this.dataService.services$.subscribe(services => {
      this.services = services;
      this.onServiceChange();
    });

    this.route.queryParams.subscribe(params => {
      this.date = params['date'] || new Date().toISOString().split('T')[0];
      this.time = params['time'] || '09:00';
      if (params['staffId']) {
        this.staffId = params['staffId'];
        this.selectedStaff = this.staffList.find(s => s.id === this.staffId || (s as any)._id === this.staffId);
      }
    });
  }

  get formattedDate(): string {
    if (!this.date) return '';
    return new Date(this.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  onServiceChange() {
    this.selectedService = this.services.find(s => s.id === this.serviceId);
  }

  goBack() {
    this.location.back();
  }

  bookAppointment() {
    if (!this.clientName || !this.clientPhone || !this.serviceId) return;

    this.dataService.bookAppointment({
      clientId: 'c' + Date.now(), // Generate mock client ID
      clientName: this.clientName,
      clientPhone: this.clientPhone,
      staffId: this.staffId,
      serviceId: this.serviceId,
      date: this.date,
      time: this.time,
      notes: this.notes
    });

    // Simulate toast notification / success then redirect
    alert('Appointment Booked Successfully!');
    this.router.navigate(['/app/calendar']);
  }
}
