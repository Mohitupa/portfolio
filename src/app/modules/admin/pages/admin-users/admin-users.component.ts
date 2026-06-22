import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="font-serif text-3xl font-extrabold mb-2 text-foreground">Admin Users</h1>
      <p class="text-muted-foreground text-sm">Manage user accounts and credentials.</p>
    </div>
  `
})
export class AdminUsersComponent {}
