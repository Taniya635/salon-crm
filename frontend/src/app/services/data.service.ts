import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Staff, ServiceItem, Appointment, Bill } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:5001/api';

  private staffSubject = new BehaviorSubject<Staff[]>([]);
  private servicesSubject = new BehaviorSubject<ServiceItem[]>([]);
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  private billsSubject = new BehaviorSubject<Bill[]>([]);

  public staff$ = this.staffSubject.asObservable();
  public services$ = this.servicesSubject.asObservable();
  public appointments$: Observable<Appointment[]> = this.appointmentsSubject.asObservable();
  public bills$: Observable<Bill[]> = this.billsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private get headers() {
    const token = localStorage.getItem('salon_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  private loadInitialData() {
    this.http.get<Staff[]>(`${this.apiUrl}/staff`).subscribe(data => this.staffSubject.next(data));
    this.http.get<ServiceItem[]>(`${this.apiUrl}/services`).subscribe(data => this.servicesSubject.next(data));
    this.http.get<Appointment[]>(`${this.apiUrl}/appointments`).subscribe(data => this.appointmentsSubject.next(data));
    this.http.get<Bill[]>(`${this.apiUrl}/bills`).subscribe(data => this.billsSubject.next(data));
  }

  refreshAppointments() {
    this.http.get<Appointment[]>(`${this.apiUrl}/appointments`).subscribe(data => this.appointmentsSubject.next(data));
  }

  refreshBills() {
    this.http.get<Bill[]>(`${this.apiUrl}/bills`).subscribe(data => this.billsSubject.next(data));
  }

  getStaffSync(): Staff[] {
    return this.staffSubject.value;
  }

  getServicesSync(): ServiceItem[] {
    return this.servicesSubject.value;
  }

  bookAppointment(appt: Omit<Appointment, 'id' | 'status'>): void {
    this.http.post<Appointment>(`${this.apiUrl}/appointments`, appt, this.headers)
      .subscribe(() => {
        this.refreshAppointments();
      });
  }

  updateAppointment(id: string, updates: Partial<Appointment>): void {
    this.http.patch<Appointment>(`${this.apiUrl}/appointments/${id}`, updates, this.headers)
      .subscribe(() => {
        this.refreshAppointments();
      });
  }

  cancelAppointment(id: string): void {
    this.http.patch<Appointment>(`${this.apiUrl}/appointments/${id}/cancel`, {}, this.headers)
      .subscribe(() => {
        this.refreshAppointments();
      });
  }

  getAppointmentById(id: string): Appointment | undefined {
    return this.appointmentsSubject.value.find(a => a.id === id || (a as any)._id === id);
  }

  generateBill(appointmentId: string, discount: number = 0, taxRate: number = 0.1): void {
    this.http.post<Bill>(`${this.apiUrl}/bills`, { appointmentId, discount, taxRate }, this.headers)
      .subscribe(() => {
        this.refreshBills();
      });
  }
}
