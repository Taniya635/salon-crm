import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Bill, Appointment, ServiceItem, Staff } from '../../models/types';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="billing-page">
      <div class="page-header print-hide">
        <div>
          <h1 class="page-title">Billing & Invoices</h1>
          <p class="page-subtitle">Manage payments and generate receipts</p>
        </div>
      </div>

      <div class="bills-container">
        <div *ngIf="bills.length === 0" class="no-bills print-hide">
          <i class="fa-solid fa-file-invoice" style="font-size: 3rem; color: var(--color-border); margin-bottom: 1rem;"></i>
          <p>No bills generated yet.</p>
        </div>

        <div class="bill-card card animate-slide-up" *ngFor="let bill of bills; let i = index" [style.animation-delay]="i * 0.1 + 's'">
          <div class="bill-header animate-fade-in stagger-1">
            <div class="logo">
              <i class="fa-solid fa-spa"></i>
            </div>
            <div class="salon-info">
              <h2>Luxe Salon</h2>
              <p>123 Elegance Blvd, Style City, SC 12345</p>
              <p>Phone: (555) 123-4567</p>
            </div>
            <div class="bill-meta">
              <h3>INVOICE</h3>
              <p><strong>Date:</strong> {{ bill.createdAt | date:'mediumDate' }}</p>
              <p><strong>Invoice #:</strong> {{ bill.id.toUpperCase() }}</p>
            </div>
          </div>

          <div class="bill-details animate-fade-in stagger-2" *ngIf="getApptDetails(bill.appointmentId) as details">
            <div class="client-info">
              <h4>Billed To:</h4>
              <p><strong>{{ details.appt.clientName }}</strong></p>
              <p>{{ details.appt.clientPhone }}</p>
            </div>
            <div class="staff-info">
              <h4>Service Provider:</h4>
              <p>{{ details.staff?.name }}</p>
            </div>
          </div>

          <table class="custom-table invoice-table animate-fade-in stagger-3">
            <thead>
              <tr>
                <th>Service Description</th>
                <th>Date / Time</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="getApptDetails(bill.appointmentId) as details">
                <td>{{ details.service?.name }}</td>
                <td>{{ details.appt.date | date }} - {{ details.appt.time }}</td>
                <td style="text-align: right;">\${{ bill.subtotal | number:'1.2-2' }}</td>
              </tr>
            </tbody>
          </table>

          <div class="bill-summary animate-fade-in stagger-4">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>\${{ bill.subtotal | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row" *ngIf="bill.discount > 0">
              <span>Discount</span>
              <span>-\${{ bill.discount | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row">
              <span>Tax (10%)</span>
              <span>\${{ bill.tax | number:'1.2-2' }}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total Amount</span>
              <span>\${{ bill.total | number:'1.2-2' }}</span>
            </div>
          </div>

          <div class="bill-actions print-hide animate-fade-in stagger-5">
            <button class="btn btn-outline" (click)="shareBill(bill)">
              <i class="fa-solid fa-share-from-square"></i> Share Bill
            </button>
            <button class="btn btn-primary" (click)="printBill()">
              <i class="fa-solid fa-print"></i> Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .billing-page {
      max-width: 800px;
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
    .no-bills {
      text-align: center;
      padding: 4rem;
      color: var(--color-text-muted);
    }
    .bill-card {
      padding: 3rem;
      margin-bottom: 2rem;
    }
    .bill-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid var(--color-border);
      padding-bottom: 2rem;
      margin-bottom: 2rem;
    }
    .logo {
      width: 50px;
      height: 50px;
      background-color: var(--color-primary);
      color: var(--color-secondary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .salon-info h2 {
      margin-bottom: 0.25rem;
      color: var(--color-primary);
    }
    .salon-info p {
      color: var(--color-text-muted);
      font-size: 0.875rem;
      line-height: 1.4;
    }
    .bill-meta {
      text-align: right;
    }
    .bill-meta h3 {
      font-size: 1.5rem;
      color: var(--color-primary-light);
      margin-bottom: 0.5rem;
      letter-spacing: 2px;
    }
    .bill-meta p {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin-bottom: 0.25rem;
    }
    .bill-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    .bill-details h4 {
      color: var(--color-text-muted);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
    }
    .invoice-table {
      margin-bottom: 2rem;
    }
    .invoice-table th {
      background-color: #F8F9FA;
    }
    .bill-summary {
      width: 300px;
      margin-left: auto;
      margin-bottom: 3rem;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      color: var(--color-text-main);
    }
    .total-row {
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--color-primary);
      border-top: 2px solid var(--color-border);
      padding-top: 1rem;
      margin-top: 0.5rem;
    }
    .bill-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      border-top: 1px dashed var(--color-border);
      padding-top: 2rem;
    }
    
    @media print {
      .print-hide {
        display: none !important;
      }
      .app-sidebar { /* Assuming sidebar uses this class, we might need to adjust */
        display: none !important;
      }
      .main-content {
        margin-left: 0 !important;
      }
      .bill-card {
        box-shadow: none;
        border: none;
        padding: 0;
      }
    }
  `]
})
export class BillingComponent implements OnInit {
  bills: Bill[] = [];
  appointments: Appointment[] = [];
  services: ServiceItem[] = [];
  staff: Staff[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.services$.subscribe(services => this.services = services);
    this.dataService.staff$.subscribe(staff => this.staff = staff);
    
    this.dataService.appointments$.subscribe((appts: Appointment[]) => {
      this.appointments = appts;
    });

    this.dataService.bills$.subscribe((bills: Bill[]) => {
      // Sort bills newest first
      this.bills = [...bills].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
  }

  getApptDetails(appointmentId: string) {
    const appt = this.appointments.find(a => a.id === appointmentId);
    if (!appt) return null;

    const service = this.services.find(s => s.id === appt.serviceId);
    const staffMember = this.staff.find(s => s.id === appt.staffId);

    return { appt, service, staff: staffMember };
  }

  printBill() {
    window.print();
  }

  shareBill(bill: Bill) {
    alert(`Invoice ${bill.id} has been shared with the client.`);
  }
}
