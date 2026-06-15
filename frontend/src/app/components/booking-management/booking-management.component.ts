import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Appointment, Staff, ServiceItem } from '../../models/types';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="management-page" *ngIf="appointment">
      <div class="page-header">
        <button class="btn btn-outline back-btn" (click)="goBack()">
          <i class="fa-solid fa-arrow-left"></i> Back
        </button>
        <div>
          <h1 class="page-title">Manage Appointment</h1>
          <p class="page-subtitle">View details, reschedule, or cancel</p>
        </div>
      </div>

      <div class="card details-card animate-slide-up">
        <div class="status-banner" [ngClass]="appointment.status">
          <i class="fa-solid" [ngClass]="{'fa-calendar-check': appointment.status === 'booked', 'fa-ban': appointment.status === 'cancelled', 'fa-check-double': appointment.status === 'completed'}"></i>
          <span>Status: {{ appointment.status | titlecase }}</span>
        </div>

        <div class="details-grid">
          <!-- Read Only View -->
          <div class="detail-section animate-fade-in stagger-1" *ngIf="!isEditingDetails">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="margin: 0;"><i class="fa-regular fa-user"></i> Client Information</h3>
              <button class="btn btn-outline btn-sm" (click)="toggleEditDetails()" *ngIf="appointment.status === 'booked'">
                <i class="fa-solid fa-pen"></i> Edit
              </button>
            </div>
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">{{ appointment.clientName }}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value">{{ appointment.clientPhone }}</span>
            </div>
            <div class="info-row" *ngIf="appointment.notes">
              <span class="label">Notes:</span>
              <span class="value">{{ appointment.notes }}</span>
            </div>
          </div>

          <div class="detail-section animate-fade-in stagger-2" *ngIf="!isEditingDetails">
            <h3><i class="fa-solid fa-scissors"></i> Service Details</h3>
            <div class="info-row">
              <span class="label">Service:</span>
              <span class="value">{{ serviceName }}</span>
            </div>
            <div class="info-row">
              <span class="label">Staff:</span>
              <span class="value">{{ staffName }}</span>
            </div>
            <div class="info-row">
              <span class="label">Price:</span>
              <span class="value font-semibold">\${{ servicePrice }}</span>
            </div>
          </div>

          <!-- Edit Mode View -->
          <div class="detail-section edit-mode animate-fade-in" *ngIf="isEditingDetails" style="grid-column: span 2;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="margin: 0;"><i class="fa-solid fa-pen-to-square"></i> Edit Details</h3>
              <div>
                <button class="btn btn-outline btn-sm mr-2" (click)="cancelEditDetails()">Cancel</button>
                <button class="btn btn-primary btn-sm" (click)="saveEditDetails()">Save Details</button>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group flex-1">
                <label>Client Name</label>
                <input type="text" [(ngModel)]="editClientName" />
              </div>
              <div class="form-group flex-1">
                <label>Client Phone</label>
                <input type="tel" [(ngModel)]="editClientPhone" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group flex-1">
                <label>Service</label>
                <select [(ngModel)]="editServiceId">
                  <option *ngFor="let srv of allServices" [value]="srv.id">{{srv.name}} (\${{srv.price}})</option>
                </select>
              </div>
              <div class="form-group flex-1">
                <label>Staff</label>
                <select [(ngModel)]="editStaffId">
                  <option *ngFor="let st of allStaff" [value]="st.id">{{st.name}}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Notes</label>
              <textarea [(ngModel)]="editNotes" rows="2"></textarea>
            </div>
          </div>
        </div>

        <div class="reschedule-section animate-fade-in stagger-3" *ngIf="appointment.status === 'booked'">
          <h3><i class="fa-regular fa-clock"></i> Reschedule</h3>
          <div class="form-row">
            <div class="form-group flex-1">
              <label>New Date</label>
              <input type="date" [(ngModel)]="editDate" />
            </div>
            <div class="form-group flex-1">
              <label>New Time</label>
              <select [(ngModel)]="editTime">
                <option *ngFor="let t of timeSlots" [value]="t">{{t}}</option>
              </select>
            </div>
            <div class="form-group" style="display: flex; align-items: flex-end;">
              <button class="btn btn-secondary" (click)="saveChanges()" [disabled]="!hasChanges()">
                Update Schedule
              </button>
            </div>
          </div>
        </div>

        <div class="actions-bar animate-fade-in stagger-4">
          <div class="left-actions">
            <button class="btn btn-outline" (click)="shareAppointment('client')">
              <i class="fa-brands fa-whatsapp"></i> Share with Client
            </button>
            <button class="btn btn-outline" (click)="shareAppointment('staff')">
              <i class="fa-solid fa-share-nodes"></i> Notify Staff
            </button>
          </div>
          <div class="right-actions" *ngIf="appointment.status === 'booked'">
            <button class="btn btn-primary" (click)="generateBill()">
              <i class="fa-solid fa-file-invoice-dollar"></i> Generate Bill
            </button>
            <button class="btn btn-danger" (click)="cancelAppointment()">
              <i class="fa-solid fa-ban"></i> Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="!appointment" class="not-found">
      Appointment not found.
    </div>
  `,
  styles: [`
    .management-page {
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
    .details-card {
      padding: 0;
    }
    .status-banner {
      padding: 1rem 2rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.125rem;
      border-bottom: 1px solid var(--color-border);
    }
    .status-banner.booked {
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--color-success);
      animation: pulseGlow 2s infinite;
    }
    .status-banner.cancelled {
      background-color: rgba(239, 68, 68, 0.1);
      color: var(--color-danger);
    }
    .status-banner.completed {
      background-color: rgba(245, 158, 11, 0.1);
      color: var(--color-warning);
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      padding: 2rem;
      border-bottom: 1px solid var(--color-border);
    }
    .detail-section h3 {
      font-size: 1.125rem;
      margin-bottom: 1rem;
      color: var(--color-primary-light);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .info-row {
      display: flex;
      margin-bottom: 0.75rem;
    }
    .info-row .label {
      width: 80px;
      color: var(--color-text-muted);
      font-size: 0.875rem;
    }
    .info-row .value {
      flex: 1;
      color: var(--color-text-main);
    }
    .font-semibold {
      font-weight: 600;
    }
    .reschedule-section {
      padding: 2rem;
      background-color: #F8F9FA;
      border-bottom: 1px solid var(--color-border);
    }
    .reschedule-section h3 {
      font-size: 1.125rem;
      margin-bottom: 1rem;
      color: var(--color-primary-light);
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .flex-1 { flex: 1; }
    .actions-bar {
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--color-bg-card);
    }
    .left-actions, .right-actions {
      display: flex;
      gap: 1rem;
    }
    .not-found {
      text-align: center;
      padding: 4rem;
      font-size: 1.25rem;
      color: var(--color-text-muted);
    }
    .btn-sm {
      padding: 0.3rem 0.6rem;
      font-size: 0.875rem;
    }
    .mr-2 {
      margin-right: 0.5rem;
    }
    .edit-mode {
      background: #F8F9FA;
      padding: 1.5rem;
      border-radius: var(--radius-md);
      border: 1px dashed var(--color-border);
    }
  `]
})
export class BookingManagementComponent implements OnInit {
  appointment?: Appointment;
  staffName: string = '';
  serviceName: string = '';
  servicePrice: number = 0;

  editDate: string = '';
  editTime: string = '';
  timeSlots: string[] = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  isEditingDetails: boolean = false;
  editClientName: string = '';
  editClientPhone: string = '';
  editNotes: string = '';
  editServiceId: string = '';
  editStaffId: string = '';

  allServices: ServiceItem[] = [];
  allStaff: Staff[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService.staff$.subscribe(staff => this.allStaff = staff);
    this.dataService.services$.subscribe(services => this.allServices = services);

    this.route.params.subscribe(params => {
      const id = params['id'];
      // Wait for appointments to be loaded
      this.dataService.appointments$.subscribe(() => {
        this.loadAppointment(id);
      });
    });
  }

  loadAppointment(id: string) {
    this.appointment = this.dataService.getAppointmentById(id);
    if (this.appointment) {
      const staff = this.allStaff.find(s => s.id === this.appointment!.staffId || (s as any)._id === this.appointment!.staffId);
      const service = this.allServices.find(s => s.id === this.appointment!.serviceId || (s as any)._id === this.appointment!.serviceId);
      
      this.staffName = staff?.name || 'Unknown Staff';
      this.serviceName = service?.name || 'Unknown Service';
      this.servicePrice = service?.price || 0;

      this.editDate = this.appointment.date;
      this.editTime = this.appointment.time;
    }
  }

  goBack() {
    this.location.back();
  }

  hasChanges(): boolean {
    if (!this.appointment) return false;
    return this.editDate !== this.appointment.date || this.editTime !== this.appointment.time;
  }

  saveChanges() {
    if (this.appointment && this.hasChanges()) {
      this.dataService.updateAppointment(this.appointment.id, {
        date: this.editDate,
        time: this.editTime
      });
      alert('Appointment rescheduled successfully!');
      this.loadAppointment(this.appointment.id);
    }
  }

  toggleEditDetails() {
    if (!this.appointment) return;
    this.editClientName = this.appointment.clientName;
    this.editClientPhone = this.appointment.clientPhone;
    this.editNotes = this.appointment.notes || '';
    this.editServiceId = this.appointment.serviceId;
    this.editStaffId = this.appointment.staffId;
    this.isEditingDetails = true;
  }

  cancelEditDetails() {
    this.isEditingDetails = false;
  }

  saveEditDetails() {
    if (!this.appointment) return;
    this.dataService.updateAppointment(this.appointment.id, {
      clientName: this.editClientName,
      clientPhone: this.editClientPhone,
      notes: this.editNotes,
      serviceId: this.editServiceId,
      staffId: this.editStaffId
    });
    alert('Appointment details updated successfully!');
    this.isEditingDetails = false;
    this.loadAppointment(this.appointment.id);
  }

  cancelAppointment() {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      if (this.appointment) {
        this.dataService.cancelAppointment(this.appointment.id);
        this.loadAppointment(this.appointment.id);
      }
    }
  }

  shareAppointment(target: 'client' | 'staff') {
    alert(`Appointment details have been shared with the ${target} via SMS/WhatsApp.`);
  }

  generateBill() {
    if (this.appointment) {
      // Simulate moving to completed when billed
      this.dataService.updateAppointment(this.appointment.id, { status: 'completed' });
      const bill = this.dataService.generateBill(this.appointment.id);
      this.router.navigate(['/app/billing']);
    }
  }
}
