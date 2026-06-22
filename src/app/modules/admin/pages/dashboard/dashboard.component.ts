import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="font-serif text-3xl font-extrabold mb-2 text-foreground">Dashboard</h1>
      <p class="text-muted-foreground text-sm">Welcome to your Portfolio CMS Admin Panel.</p>
    </div>
  `
})
export class DashboardComponent {}
