import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-contact-message-detail',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="font-serif text-3xl font-extrabold mb-2 text-foreground">Message Detail</h1>
      <p class="text-muted-foreground text-sm">Read submission contents.</p>
    </div>
  `
})
export class ContactMessageDetailComponent {}
