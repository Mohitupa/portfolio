import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminRole, AdminUserItem, AdminUserPayload } from '../../../../models/admin.model';
import { AdminApiService } from '../../../../services/admin-api.service';
import { AuthService } from '../../../../services/auth.service';

type UserFormMode = 'create' | 'edit';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [DatePipe, NgClass, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminApi = inject(AdminApiService);
  auth = inject(AuthService);

  users = signal<AdminUserItem[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  notice = signal('');
  formOpen = signal(false);
  formMode = signal<UserFormMode>('create');
  selectedUser = signal<AdminUserItem | null>(null);
  actionId = signal('');

  activeCount = computed(() => this.users().filter(user => user.isActive).length);
  superAdminCount = computed(() => this.users().filter(user => user.role === 'SUPER_ADMIN').length);

  userForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: ['ADMIN' as AdminRole, [Validators.required]],
    isActive: [true],
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set('');

    this.adminApi.getAdminUsers()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: response => this.users.set(response.data ?? []),
        error: error => this.error.set(error?.error?.message || 'Could not load admin users. The backend admin-users route may not be implemented yet.'),
      });
  }

  openCreateForm(): void {
    this.formMode.set('create');
    this.selectedUser.set(null);
    this.formOpen.set(true);
    this.notice.set('');
    this.error.set('');
    this.userForm.reset({
      name: '',
      email: '',
      password: '',
      role: 'ADMIN',
      isActive: true,
    });
    this.userForm.controls.password.setValidators([Validators.required, Validators.minLength(8)]);
    this.userForm.controls.password.updateValueAndValidity();
  }

  openEditForm(user: AdminUserItem): void {
    this.formMode.set('edit');
    this.selectedUser.set(user);
    this.formOpen.set(true);
    this.notice.set('');
    this.error.set('');
    this.userForm.reset({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
    });
    this.userForm.controls.password.clearValidators();
    this.userForm.controls.password.updateValueAndValidity();
  }

  closeForm(): void {
    this.formOpen.set(false);
    this.selectedUser.set(null);
    this.userForm.reset();
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const value = this.userForm.getRawValue();
    const payload: AdminUserPayload = {
      name: value.name,
      email: value.email,
      role: value.role,
      isActive: value.isActive,
    };

    if (value.password) {
      payload.password = value.password;
    }

    this.saving.set(true);
    this.error.set('');
    this.notice.set('');

    const selected = this.selectedUser();
    const request = this.formMode() === 'create'
      ? this.adminApi.createAdminUser(payload)
      : this.adminApi.updateAdminUser(this.userId(selected!), payload);

    request
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: response => {
          if (this.formMode() === 'create') {
            this.users.update(users => [response.data, ...users]);
            this.notice.set('Admin user created successfully.');
          } else {
            this.users.update(users => users.map(user => this.userId(user) === this.userId(response.data) ? response.data : user));
            this.notice.set('Admin user updated successfully.');
          }
          this.closeForm();
        },
        error: error => this.error.set(error?.error?.message || 'Could not save admin user. The backend admin-users route may not be implemented yet.'),
      });
  }

  toggleActive(user: AdminUserItem): void {
    this.actionId.set(this.userId(user));
    this.error.set('');
    this.notice.set('');

    this.adminApi.updateAdminUser(this.userId(user), { isActive: !user.isActive })
      .pipe(finalize(() => this.actionId.set('')))
      .subscribe({
        next: response => {
          this.users.update(users => users.map(item => this.userId(item) === this.userId(user) ? response.data : item));
          this.notice.set(`Admin user ${response.data.isActive ? 'activated' : 'deactivated'}.`);
        },
        error: error => this.error.set(error?.error?.message || 'Could not update this admin user.'),
      });
  }

  deleteUser(user: AdminUserItem): void {
    if (this.isCurrentUser(user)) {
      this.error.set('You cannot delete the account you are currently using.');
      return;
    }

    if (!window.confirm(`Delete "${user.name}"? This cannot be undone.`)) {
      return;
    }

    this.actionId.set(this.userId(user));
    this.error.set('');
    this.notice.set('');

    this.adminApi.deleteAdminUser(this.userId(user))
      .pipe(finalize(() => this.actionId.set('')))
      .subscribe({
        next: () => {
          this.users.update(users => users.filter(item => this.userId(item) !== this.userId(user)));
          this.notice.set('Admin user deleted successfully.');
        },
        error: error => this.error.set(error?.error?.message || 'Could not delete this admin user.'),
      });
  }

  userId(user: AdminUserItem): string {
    return user._id || user.id || user.email;
  }

  isCurrentUser(user: AdminUserItem): boolean {
    const current = this.auth.currentUser();
    return !!current && (current.id === user._id || current.id === user.id || current.email === user.email);
  }

  trackUser = (_: number, user: AdminUserItem): string => this.userId(user);
}
