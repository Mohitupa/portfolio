import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-media',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="font-serif text-3xl font-extrabold mb-2 text-foreground">Media Library</h1>
      <p class="text-muted-foreground text-sm">Upload, review, and delete media files.</p>
    </div>
  `
})
export class MediaComponent {}
