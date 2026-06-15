import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { BookingComponent } from './components/booking/booking.component';
import { BookingManagementComponent } from './components/booking-management/booking-management.component';
import { BillingComponent } from './components/billing/billing.component';
import { PlaceholderComponent } from './components/placeholder.component';
import { LandingComponent } from './components/landing/landing.component';
import { AppointmentsListComponent } from './components/appointments/appointments-list.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'app',
    component: MainLayoutComponent,
    children: [
      { path: 'calendar', component: CalendarComponent },
      { path: 'appointments', component: AppointmentsListComponent },
      { path: 'appointments/book', component: BookingComponent },
      { path: 'appointments/:id/manage', component: BookingManagementComponent },
      { path: 'billing', component: BillingComponent },
      { path: 'staff', component: PlaceholderComponent },
      { path: 'clients', component: PlaceholderComponent },
      { path: 'settings', component: PlaceholderComponent },
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },
      { path: '**', component: PlaceholderComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

