import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="font-serif text-3xl font-extrabold mb-2 text-foreground">Settings</h1>
      <p class="text-muted-foreground text-sm">Configure system configurations and site features.</p>
    </div>
  `
})
export class SettingsComponent {}
