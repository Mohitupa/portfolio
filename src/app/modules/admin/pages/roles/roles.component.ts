import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf, DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminApiService } from '../../../../services/admin-api.service';
import { ToastService } from '../../../../services/toast.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';

type Role = {
  _id?: string;
  id?: string;
  name: string;
  displayName?: string;
  description?: string;
  isSystem?: boolean;
  sortOrder?: number;
};

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, NgClass, DatePipe, RouterLink, ReactiveFormsModule, HasPermissionDirective],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminApi = inject(AdminApiService);
  private toast = inject(ToastService);

  roles = signal<Role[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  notice = signal('');

  search = signal('');
  showCreatePanel = signal(false);

  actionId = signal('');

  createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    displayName: [''],
    description: [''],
    isSystem: [false],
    sortOrder: [0],
  });

  ngOnInit(): void {
    this.loadRoles();
  }

  filteredRoles = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.roles();
    return this.roles().filter(r => {
      const name = (r.name ?? '').toLowerCase();
      const displayName = (r.displayName ?? '').toLowerCase();
      return name.includes(q) || displayName.includes(q);
    });
  });

  openCreatePanel(): void {
    this.notice.set('');
    this.error.set('');
    this.showCreatePanel.set(true);

    this.createForm.reset({
      name: '',
      displayName: '',
      description: '',
      isSystem: false,
      sortOrder: 0,
    });
  }

  closeCreatePanel(): void {
    this.showCreatePanel.set(false);
    this.createForm.reset();
  }

  loadRoles(): void {
    this.loading.set(true);
    this.error.set('');

    this.adminApi.getRolesList()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => this.roles.set(res?.data ?? res ?? []),
        error: (err: unknown) => {
          const message =
            (err as any)?.error?.message || 'Could not load roles.';
          this.error.set(message);
          this.toast.error(message);
        }
      });
  }

  createRole(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.notice.set('');

    const payload = this.createForm.getRawValue();

    this.adminApi.createRole(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response: any) => {
          if (response?.data) {
            this.roles.update(items => [response.data, ...items]);
          }
          this.toast.success('Role created successfully.');
          this.closeCreatePanel();
        },
        error: (err: unknown) =>
          this.toast.error((err as any)?.error?.message || 'Could not create role.')
      });
  }

  roleId(role: Role): string {
    return role._id || role.id || role.name;
  }

  trackRole = (_: number, role: Role): string => {
    return this.roleId(role);
  };

  deleteRole(role: Role): void {
    const id = this.roleId(role);
    const confirmed = window.confirm(`Delete "${role.displayName || role.name}"? This cannot be undone.`);
    if (!confirmed) return;

    this.actionId.set(id);
    this.error.set('');
    this.notice.set('');

    this.adminApi.deleteRole(id)
      .pipe(finalize(() => this.actionId.set('')))
      .subscribe({
        next: () => {
          this.roles.update(items => items.filter(r => this.roleId(r) !== id));
          this.toast.success('Role deleted successfully.');
        },
        error: (err: unknown) =>
          this.toast.error((err as any)?.error?.message || 'Could not delete role.')
      });
  }
}
