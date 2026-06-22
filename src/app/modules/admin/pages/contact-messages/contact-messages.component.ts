import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-contact-messages',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="font-serif text-3xl font-extrabold mb-2 text-foreground">Contact Messages</h1>
      <p class="text-muted-foreground text-sm">View and manage public messages.</p>
    </div>
  `
})
export class ContactMessagesComponent {}
