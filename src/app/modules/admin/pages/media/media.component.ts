import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { MediaItem } from '../../../../models/admin.model';
import { AdminApiService } from '../../../../services/admin-api.service';

@Component({
  selector: 'app-admin-media',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NgClass, NgFor, NgIf],
  templateUrl: './media.component.html',
  styleUrl: './media.component.css',
})
export class MediaComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  media = signal<MediaItem[]>([]);
  loading = signal(false);
  uploading = signal(false);
  dragActive = signal(false);
  selectedFile = signal<File | null>(null);
  deletingId = signal('');
  error = signal('');
  notice = signal('');

  selectedFileName = computed(() => this.selectedFile()?.name || '');
  imageCount = computed(() => this.media().filter(item => this.isImage(item)).length);
  totalSizeMb = computed(() => this.media().reduce((total, item) => total + item.size, 0) / 1024 / 1024);

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.loading.set(true);
    this.error.set('');

    this.adminApi.getMedia()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: response => this.media.set(response.data ?? []),
        error: error => this.error.set(error?.error?.message || 'Could not load media library.'),
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile.set(input.files?.[0] || null);
    this.notice.set('');
    this.error.set('');
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragActive.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragActive.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragActive.set(false);
    this.selectedFile.set(event.dataTransfer?.files?.[0] || null);
    this.notice.set('');
    this.error.set('');
  }

  uploadSelectedFile(): void {
    const file = this.selectedFile();

    if (!file) {
      return;
    }

    this.uploading.set(true);
    this.error.set('');
    this.notice.set('');

    this.adminApi.uploadMedia(file)
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: response => {
          this.media.update(items => [response.data, ...items]);
          this.selectedFile.set(null);
          this.notice.set('File uploaded successfully.');
        },
        error: error => this.error.set(error?.error?.message || 'Could not upload this file.'),
      });
  }

  deleteMedia(item: MediaItem): void {
    if (!window.confirm(`Delete "${item.originalName}"? This cannot be undone.`)) {
      return;
    }

    this.deletingId.set(item._id);
    this.error.set('');
    this.notice.set('');

    this.adminApi.deleteMedia(item._id)
      .pipe(finalize(() => this.deletingId.set('')))
      .subscribe({
        next: () => {
          this.media.update(items => items.filter(media => media._id !== item._id));
          this.notice.set('Media deleted successfully.');
        },
        error: error => this.error.set(error?.error?.message || 'Could not delete this media item.'),
      });
  }

  copyUrl(item: MediaItem): void {
    const url = this.assetUrl(item);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => this.notice.set('Media URL copied.'))
        .catch(() => this.error.set(url));
      return;
    }

    this.notice.set(url);
  }

  assetUrl(item: MediaItem): string {
    return this.adminApi.getPublicAssetUrl(item.filePath);
  }

  isImage(item: MediaItem): boolean {
    return item.mimeType?.startsWith('image/');
  }

  extension(item: MediaItem): string {
    const extension = item.originalName.split('.').pop();
    return extension && extension !== item.originalName ? extension : 'file';
  }

  formatBytes(size: number): string {
    if (!size) {
      return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
    const value = size / Math.pow(1024, index);

    return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
  }

  trackMedia = (_: number, item: MediaItem): string => item._id;
}
