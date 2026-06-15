import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-page">
      <!-- Navbar -->
      <nav class="navbar animate-slide-in-top">
        <div class="nav-container">
          <a href="#home" class="logo">
            <i class="fa-solid fa-spa gradient-text"></i>
            <span class="logo-text">Luxe Salon</span>
          </a>
          
          <div class="nav-links">
            <a href="#about" class="nav-link">About</a>
            <a href="#features" class="nav-link">Features</a>
            <a href="#contact" class="nav-link">Contact</a>
          </div>

          <div class="nav-auth">
            <a routerLink="/login" class="btn btn-primary login-btn">
              <span>Log In</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero" id="home">
        <div class="hero-content">
          <h1 class="animate-slide-up stagger-1 gradient-text">Elevate Your Salon Experience</h1>
          <p class="animate-fade-in stagger-2">The all-in-one elegant CRM solution designed to help beauty professionals manage appointments, staff, and clients seamlessly.</p>
          <div class="hero-actions animate-fade-in stagger-3">
            <a routerLink="/login" class="btn btn-primary hero-btn">
              Sign In to Dashboard
            </a>
            <a href="#features" class="btn btn-outline hero-btn">
              Learn More
            </a>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="section about-section" id="about">
        <div class="section-container">
          <div class="section-header text-center">
            <h2 class="gradient-text">About Luxe Salon CRM</h2>
            <p>Built for the modern beauty industry.</p>
          </div>
          <div class="about-grid">
            <div class="about-card card">
              <div class="icon-circle"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
              <h3>Elegant Design</h3>
              <p>A beautiful, intuitive interface that your staff and clients will love using every day.</p>
            </div>
            <div class="about-card card">
              <div class="icon-circle"><i class="fa-solid fa-bolt"></i></div>
              <h3>Fast Performance</h3>
              <p>Optimized for speed so you can manage your salon without any lag or downtime.</p>
            </div>
            <div class="about-card card">
              <div class="icon-circle"><i class="fa-solid fa-shield-halved"></i></div>
              <h3>Secure Data</h3>
              <p>Your client data and business analytics are safely stored and encrypted.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="section features-section" id="features">
        <div class="section-container">
          <div class="section-header text-center">
            <h2 class="gradient-text">Powerful Features</h2>
            <p>Everything you need to run your business smoothly.</p>
          </div>
          <div class="features-grid">
            <div class="feature-item">
              <i class="fa-regular fa-calendar-check"></i>
              <div class="feature-text">
                <h4>Smart Scheduling</h4>
                <p>Drag-and-drop calendar makes booking a breeze.</p>
              </div>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-users"></i>
              <div class="feature-text">
                <h4>Client Management</h4>
                <p>Keep track of preferences, history, and notes.</p>
              </div>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-file-invoice-dollar"></i>
              <div class="feature-text">
                <h4>Integrated Billing</h4>
                <p>Generate invoices and track payments effortlessly.</p>
              </div>
            </div>
            <div class="feature-item">
              <i class="fa-solid fa-chart-line"></i>
              <div class="feature-text">
                <h4>Business Analytics</h4>
                <p>Gain insights into your top services and staff.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="section contact-section" id="contact">
        <div class="section-container">
          <div class="contact-card card">
            <div class="contact-info">
              <h2 class="gradient-text">Get In Touch</h2>
              <p>Have questions? Our support team is here to help.</p>
              <div class="contact-methods">
                <div class="method"><i class="fa-solid fa-envelope"></i> support&#64;luxesalon.com</div>
                <div class="method"><i class="fa-solid fa-phone"></i> +1 (555) 123-4567</div>
              </div>
            </div>
            <form class="contact-form">
              <div class="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div class="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div class="form-group">
                <textarea rows="4" placeholder="Your Message" required></textarea>
              </div>
              <button class="btn btn-secondary" type="button" (click)="submitContact()">Send Message</button>
            </form>
          </div>
        </div>
      </section>
      
      <!-- Footer -->
      <footer class="footer">
        <p>&copy; 2026 Luxe Salon CRM. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
      background-color: var(--color-bg-body);
      scroll-behavior: smooth;
    }
    
    /* Navbar */
    .navbar {
      position: fixed;
      top: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.6);
      z-index: 1000;
      padding: 1rem 0;
      box-shadow: var(--shadow-sm);
    }
    
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .navbar .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 700;
      font-family: var(--font-heading);
    }
    
    .nav-links {
      display: flex;
      gap: 2rem;
    }
    
    .nav-link {
      font-weight: 500;
      color: var(--color-text-main);
      transition: color var(--transition-fast);
      position: relative;
    }
    
    .nav-link:hover {
      color: var(--color-secondary);
    }
    
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--color-secondary);
      transition: width var(--transition-fast);
    }
    
    .nav-link:hover::after {
      width: 100%;
    }
    
    .nav-auth {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .login-link {
      font-weight: 600;
    }
    
    .register-btn {
      padding: 0.6rem 1.25rem;
      border-radius: 99px;
      gap: 0.5rem;
    }
    
    /* Hero Section */
    .hero {
      padding: 12rem 2rem 8rem;
      text-align: center;
      background: radial-gradient(circle at top right, hsla(33, 38%, 77%, 0.15) 0%, transparent 60%),
                  radial-gradient(circle at bottom left, hsla(215, 39%, 11%, 0.05) 0%, transparent 60%);
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .hero h1 {
      font-size: 4rem;
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }
    
    .hero p {
      font-size: 1.25rem;
      color: var(--color-text-muted);
      margin-bottom: 3rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
    }
    
    .hero-btn {
      padding: 1rem 2.5rem;
      font-size: 1.125rem;
      border-radius: 99px;
    }
    
    /* Sections */
    .section {
      padding: 6rem 2rem;
    }
    
    .section-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .section-header {
      margin-bottom: 4rem;
    }
    
    .section-header h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .text-center {
      text-align: center;
    }
    
    /* About */
    .about-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .about-card {
      padding: 3rem 2rem;
      text-align: center;
      transition: transform var(--transition-normal);
    }
    
    .about-card:hover {
      transform: translateY(-10px);
    }
    
    .icon-circle {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--color-primary) 0%, #2A3648 100%);
      color: var(--color-secondary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 16px rgba(17, 24, 39, 0.2);
    }
    
    /* Features */
    .features-section {
      background-color: #FFFFFF;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 3rem;
    }
    
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
    }
    
    .feature-item i {
      font-size: 2rem;
      color: var(--color-secondary);
      background: rgba(196, 164, 132, 0.15);
      padding: 1rem;
      border-radius: var(--radius-md);
    }
    
    .feature-text h4 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      color: var(--color-primary);
    }
    
    .feature-text p {
      color: var(--color-text-muted);
    }
    
    /* Contact */
    .contact-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 0;
    }
    
    .contact-info {
      padding: 4rem;
      background: linear-gradient(135deg, var(--color-primary) 0%, #2A3648 100%);
      color: white;
    }
    
    .contact-info h2 {
      color: white;
      margin-bottom: 1rem;
      background: none;
      -webkit-text-fill-color: initial;
    }
    
    .contact-info p {
      color: rgba(255,255,255,0.8);
      margin-bottom: 2rem;
    }
    
    .contact-methods .method {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    
    .contact-form {
      padding: 4rem;
      background: var(--color-bg-card);
    }
    
    /* Footer */
    .footer {
      text-align: center;
      padding: 2rem;
      border-top: 1px solid var(--color-border);
      color: var(--color-text-muted);
    }
    
    @keyframes slideInTop {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
    
    .animate-slide-in-top {
      animation: slideInTop 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
  `]
})
export class LandingComponent {
  submitContact() {
    alert('Thank you! We will get back to you soon.');
  }
}
