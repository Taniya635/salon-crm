import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    const savedUser = localStorage.getItem('salon_user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(userId: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { userId, password }).pipe(
      tap((res: any) => this.handleAuthResponse(res))
    );
  }

  register(userId: string, password: string, name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { userId, password, role: 'client' }).pipe(
      tap((res: any) => this.handleAuthResponse(res))
    );
  }

  private handleAuthResponse(res: any) {
    const user = res.user;
    localStorage.setItem('salon_token', res.token);
    localStorage.setItem('salon_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    // Always navigate to the main CRM app
    this.router.navigate(['/app/calendar']);
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
