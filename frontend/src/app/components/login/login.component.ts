import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card card animate-slide-up">
        <div class="login-header">
          <div class="logo animate-fade-in stagger-1">
            <i class="fa-solid fa-spa"></i>
          </div>
          <h2 class="animate-fade-in stagger-2 gradient-text">Luxe Salon CRM</h2>
          <p class="animate-fade-in stagger-3">Sign in to manage your appointments</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="animate-fade-in stagger-4">
          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-with-icon">
              <i class="fa-regular fa-envelope"></i>
              <input type="email" id="email" name="email" [(ngModel)]="email" required placeholder="Enter Email" />
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-with-icon">
              <i class="fa-solid fa-lock"></i>
              <input [type]="showPassword ? 'text' : 'password'" id="password" name="password" [(ngModel)]="password" required placeholder="Enter Password" />
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                <i class="fa-regular" [ngClass]="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="error-message animate-scale-in" *ngIf="loginError">
            <i class="fa-solid fa-circle-exclamation"></i> Invalid Email or Password
          </div>

          <div class="demo-credentials animate-scale-in">
            <i class="fa-solid fa-circle-info"></i>
            <div>
              <strong>Demo Access:</strong><br/>
              Email: <code>admin</code><br/>
              Password: <code>admin123</code>
            </div>
          </div>

          <button type="submit" class="btn btn-primary login-btn" [disabled]="!loginForm.form.valid">
            <span>Sign In</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(-45deg, #F3F4F6, #E5E7EB, #F9FAFB, #D1D5DB);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
      padding: 1rem;
    }
    
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 3rem 2.5rem;
      border: 1px solid rgba(255, 255, 255, 0.8);
    }

    .login-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .logo {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, var(--color-primary) 0%, #2A3648 100%);
      color: var(--color-secondary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 16px rgba(17, 24, 39, 0.2);
      animation: floatY 6s ease-in-out infinite;
    }

    .login-header h2 {
      margin-bottom: 0.5rem;
      font-size: 1.75rem;
    }

    .login-header p {
      color: var(--color-text-muted);
      font-size: 0.95rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .input-with-icon {
      position: relative;
    }

    .input-with-icon i {
      position: absolute;
      left: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
      transition: color var(--transition-fast);
    }
    
    .input-with-icon input:focus ~ i,
    .input-with-icon:focus-within i.fa-envelope,
    .input-with-icon:focus-within i.fa-lock,
    .input-with-icon:focus-within i.fa-id-badge {
      color: var(--color-secondary);
    }
    
    .toggle-password {
      position: absolute;
      right: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 0;
      height: auto;
      width: auto;
    }
    
    .toggle-password i {
      position: static;
      transform: none;
    }
    
    .toggle-password:hover {
      color: var(--color-primary);
    }

    .input-with-icon input {
      padding-left: 3rem;
    }

    .login-btn {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      font-size: 1rem;
      margin-top: 2rem;
      box-shadow: 0 4px 15px rgba(17, 24, 39, 0.2);
    }
    
    .login-btn:hover {
      box-shadow: 0 6px 20px rgba(17, 24, 39, 0.35);
    }

    .error-message {
      color: var(--color-danger);
      background-color: var(--color-danger-bg);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .demo-credentials {
      background-color: rgba(196, 164, 132, 0.15); /* Light primary tone */
      border: 1px solid rgba(196, 164, 132, 0.3);
      padding: 1rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      color: var(--color-text-main);
      font-size: 0.9rem;
    }
    .demo-credentials i {
      color: var(--color-primary);
      margin-top: 0.2rem;
    }
    .demo-credentials code {
      background: rgba(255, 255, 255, 0.8);
      padding: 0.1rem 0.3rem;
      border-radius: 4px;
      font-weight: 600;
      color: var(--color-secondary);
    }
    .auth-toggle {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }
    .auth-toggle a {
      color: var(--color-primary);
      font-weight: 600;
    }
    .auth-toggle a:hover {
      color: var(--color-secondary);
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loginError = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  onSubmit() {
    this.loginError = false;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // Success is handled by AuthService routing
      },
      error: (err) => {
        console.error('Login failed', err);
        this.loginError = true;
      }
    });
  }
}
