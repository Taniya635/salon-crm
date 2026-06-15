import { Component } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  template: `
    <div style="padding: 3rem; text-align: center;">
      <h2>Coming Soon</h2>
      <p style="color: var(--color-text-muted);">This page is under construction.</p>
    </div>
  `
})
export class PlaceholderComponent {}
