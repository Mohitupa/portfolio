import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-portfolios-list',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="font-serif text-3xl font-extrabold mb-2 text-foreground">Portfolios</h1>
      <p class="text-muted-foreground text-sm">Manage dynamic portfolio instances.</p>
    </div>
  `
})
export class PortfoliosListComponent {}
