import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Staff, ServiceItem, Appointment, Bill } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private staffData: Staff[] = [
    { id: 's1', name: 'Emma Watson', role: 'Senior Stylist', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 's2', name: 'James Smith', role: 'Colorist', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    { id: 's3', name: 'Sophia Lee', role: 'Hairdresser', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' }
  ];

  private servicesData: ServiceItem[] = [
    { id: 'srv1', name: "Women's Haircut", durationMinutes: 60, price: 80 },
    { id: 'srv2', name: "Men's Haircut", durationMinutes: 30, price: 40 },
    { id: 'srv3', name: 'Hair Coloring', durationMinutes: 120, price: 150 },
    { id: 'srv4', name: 'Blow Dry & Style', durationMinutes: 45, price: 50 },
    { id: 'srv5', name: 'Bridal Makeup', durationMinutes: 90, price: 200 }
  ];

  private staffSubject = new BehaviorSubject<Staff[]>(this.staffData);
  private servicesSubject = new BehaviorSubject<ServiceItem[]>(this.servicesData);
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  private billsSubject = new BehaviorSubject<Bill[]>([]);

  public staff$ = this.staffSubject.asObservable();
  public services$ = this.servicesSubject.asObservable();
  public appointments$: Observable<Appointment[]> = this.appointmentsSubject.asObservable();
  public bills$: Observable<Bill[]> = this.billsSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const savedAppts = localStorage.getItem('salon_appointments');
    if (savedAppts) {
      this.appointmentsSubject.next(JSON.parse(savedAppts));
    } else {
      const today = new Date().toISOString().split('T')[0];
      const initial: Appointment[] = [
        { id: 'a1', clientId: 'c1', clientName: 'Alice Johnson', clientPhone: '555-0101', staffId: 's1', serviceId: 'srv1', date: today, time: '10:00', status: 'booked' },
        { id: 'a2', clientId: 'c2', clientName: 'Bob Williams', clientPhone: '555-0102', staffId: 's2', serviceId: 'srv3', date: today, time: '13:00', status: 'booked' }
      ];
      this.saveAppointments(initial);
    }

    const savedBills = localStorage.getItem('salon_bills');
    if (savedBills) {
      this.billsSubject.next(JSON.parse(savedBills));
    }
  }

  private saveAppointments(appts: Appointment[]) {
    localStorage.setItem('salon_appointments', JSON.stringify(appts));
    this.appointmentsSubject.next(appts);
  }

  private saveBills(bills: Bill[]) {
    localStorage.setItem('salon_bills', JSON.stringify(bills));
    this.billsSubject.next(bills);
  }

  refreshAppointments() {
    // No-op for mock data since we use saveAppointments
  }

  refreshBills() {
    // No-op for mock data since we use saveBills
  }

  getStaffSync(): Staff[] {
    return this.staffSubject.value;
  }

  getServicesSync(): ServiceItem[] {
    return this.servicesSubject.value;
  }

  bookAppointment(appt: Omit<Appointment, 'id' | 'status'>): void {
    const newAppt: Appointment = {
      ...appt,
      id: 'a' + Date.now(),
      status: 'booked'
    };
    const current = this.appointmentsSubject.value;
    this.saveAppointments([...current, newAppt]);
  }

  updateAppointment(id: string, updates: Partial<Appointment>): void {
    const current = this.appointmentsSubject.value;
    const updated = current.map(a => a.id === id || (a as any)._id === id ? { ...a, ...updates } : a);
    this.saveAppointments(updated);
  }

  cancelAppointment(id: string): void {
    const current = this.appointmentsSubject.value;
    const updated = current.map(a => a.id === id || (a as any)._id === id ? { ...a, status: 'cancelled' as const } : a);
    this.saveAppointments(updated);
  }

  getAppointmentById(id: string): Appointment | undefined {
    return this.appointmentsSubject.value.find(a => a.id === id || (a as any)._id === id);
  }

  generateBill(appointmentId: string, discount: number = 0, taxRate: number = 0.1): void {
    const appt = this.getAppointmentById(appointmentId);
    if (!appt) throw new Error('Appointment not found');
    
    const service = this.servicesData.find(s => s.id === appt.serviceId || (s as any)._id === appt.serviceId);
    if (!service) throw new Error('Service not found');

    const subtotal = service.price;
    const discountAmount = discount;
    const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
    const tax = subtotalAfterDiscount * taxRate;
    const total = subtotalAfterDiscount + tax;

    const newBill: Bill = {
      id: 'b' + Date.now(),
      appointmentId,
      subtotal,
      tax,
      discount,
      total,
      createdAt: new Date().toISOString()
    };

    const currentBills = this.billsSubject.value;
    this.saveBills([...currentBills, newBill]);
  }
}
