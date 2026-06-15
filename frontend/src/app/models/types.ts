export interface User {
  id: string;
  username: string;
  role: 'admin' | 'staff' | 'client';
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  staffId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'booked' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Bill {
  id: string;
  appointmentId: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: string;
}
