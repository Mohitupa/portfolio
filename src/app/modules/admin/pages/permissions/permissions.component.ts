import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf, DatePipe, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminApiService } from '../../../../services/admin-api.service';
import { ToastService } from '../../../../services/toast.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';

type PermissionItem = {
  _id?: string;
  id?: string;
  name: string;
  displayName?: string;
  module?: string;
  description?: string;
  isSystem?: boolean;
  sortOrder?: number;
};

type PermissionPayload = {
  name: string;
  displayName?: string;
  module?: string;
  description?: string;
  sortOrder?: number;
  isSystem?: boolean;
};

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, DatePipe, NgClass, ReactiveFormsModule, HasPermissionDirective],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})
export class PermissionsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminApi = inject(AdminApiService);
  private toast = inject(ToastService);

  permissions = signal<PermissionItem[]>([]);
  loading = signal(false);
  saving = signal(false);

  showCreatePanel = signal(false);
  search = signal('');
  filterModule = signal<string>('');

  error = signal('');
  notice = signal('');

  actionId = signal('');

  createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    displayName: [''],
    module: [''],
    description: [''],
    sortOrder: [0],
    isSystem: [false],
  });

  ngOnInit(): void {
    this.loadPermissions();
  }

  filteredPermissions = computed(() => {
    const q = this.search().trim().toLowerCase();
    const m = this.filterModule().trim().toLowerCase();

    return this.permissions().filter(p => {
      const matchesQ =
        !q ||
        (p.name ?? '').toLowerCase().includes(q) ||
        (p.displayName ?? '').toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q);

      const matchesM = !m || (p.module ?? '').toLowerCase() === m;

      return matchesQ && matchesM;
    });
  });

  loadPermissions(): void {
    this.loading.set(true);
    this.error.set('');

    this.adminApi.getPermissions()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => this.permissions.set(res?.data ?? res ?? []),
        error: (err: unknown) => {
          const message = (err as any)?.error?.message || 'Could not load permissions.';
          this.error.set(message);
          this.toast.error(message);
        }
      });
  }

  openCreatePanel(): void {
    this.notice.set('');
    this.error.set('');
    this.showCreatePanel.set(true);
    this.createForm.reset({
      name: '',
      displayName: '',
      module: '',
      description: '',
      sortOrder: 0,
      isSystem: false,
    });
  }

  closeCreatePanel(): void {
    this.showCreatePanel.set(false);
    this.createForm.reset();
  }

  createPermission(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.notice.set('');

    const payload = this.createForm.getRawValue() as PermissionPayload;

    this.adminApi.createPermission(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (res: any) => {
          if (res?.data) {
            this.permissions.update(items => [res.data, ...items]);
          }
          this.toast.success('Permission created successfully.');
          this.closeCreatePanel();
        },
        error: (err: unknown) => {
          this.toast.error((err as any)?.error?.message || 'Could not create permission.');
        }
      });
  }

  permissionId(p: PermissionItem): string {
    return p._id || p.id || p.name;
  }

  trackPermission = (_: number, p: PermissionItem): string => {
    return this.permissionId(p);
  };

  deletePermission(p: PermissionItem): void {
    const id = this.permissionId(p);
    const confirmed = window.confirm(`Delete "${p.displayName || p.name}"? This cannot be undone.`);
    if (!confirmed) return;

    this.actionId.set(id);
    this.error.set('');
    this.notice.set('');

    this.adminApi.deletePermission(id)
      .pipe(finalize(() => this.actionId.set('')))
      .subscribe({
        next: () => {
          this.permissions.update(items => items.filter(item => this.permissionId(item) !== id));
          this.toast.success('Permission deleted successfully.');
        },
        error: (err: unknown) => this.toast.error((err as any)?.error?.message || 'Could not delete permission.')
      });
  }
}
