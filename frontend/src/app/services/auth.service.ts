import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    const savedUser = localStorage.getItem('salon_user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(userId: string, password: string): Observable<any> {
    if (userId.toLowerCase() === 'admin' && password === 'admin123') {
      const user: User = { id: 'admin1', username: 'admin', role: 'admin' };
      
      localStorage.setItem('salon_token', 'mock-jwt-token-for-admin');
      localStorage.setItem('salon_user', JSON.stringify(user));
      this.currentUserSubject.next(user);
      
      this.router.navigate(['/app/calendar']);
      return of({ user, token: 'mock-jwt-token-for-admin' });
    }
    
    return throwError(() => new Error('Invalid credentials'));
  }

  logout(): void {
    localStorage.removeItem('salon_token');
    localStorage.removeItem('salon_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
