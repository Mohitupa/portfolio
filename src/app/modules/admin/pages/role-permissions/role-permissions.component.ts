import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

@Component({
  selector: 'app-role-permissions',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, NgClass, RouterLink, ReactiveFormsModule, HasPermissionDirective],
  templateUrl: './role-permissions.component.html',
  styleUrl: './role-permissions.component.css'
})
export class RolePermissionsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private adminApi = inject(AdminApiService);
  private toast = inject(ToastService);

  roleId = signal<string>('');
  roleName = signal<string>('');

  loading = signal(false);
  saving = signal(false);
  error = signal('');

  allPermissions = signal<PermissionItem[]>([]);
  selectedPermissionNames = signal<Set<string>>(new Set<string>());

  groupedPermissions = computed(() => {
    const map = new Map<string, PermissionItem[]>();
    for (const p of this.allPermissions()) {
      const module = p.module || 'General';
      const list = map.get(module) ?? [];
      list.push(p);
      map.set(module, list);
    }
    const entries = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    return entries.map(([module, permissions]) => ({ module, permissions }));
  });

  form = inject(FormBuilder).nonNullable.group({});

  ngOnInit(): void {
    this.roleId.set(this.route.snapshot.paramMap.get('roleId') || '');
    this.loadRolePermissions();
  }

  private loadRolePermissions(): void {
    const rid = this.roleId();
    if (!rid) return;

    this.loading.set(true);
    this.error.set('');

    // We fetch all permissions, then fetch role-assigned permissions.
    // This avoids hardcoding permission lists.
    // Expected backend: role-permissions/:roleId returns list of permission ids/names.
    // We'll normalize to permission "name" when available.
    this.adminApi.getPermissions()
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (res: any) => {
          this.allPermissions.set(res?.data ?? res ?? []);
          this.adminApi.getRolePermissions(rid).subscribe({
            next: (roleRes: any) => {
              const raw = roleRes?.data ?? roleRes?.permissions ?? roleRes ?? [];
              const set = new Set<string>();

              if (Array.isArray(raw)) {
                for (const item of raw) {
                  if (typeof item === 'string') set.add(item);
                  else if (item?.name) set.add(item.name);
                  else if (item?.permission) set.add(item.permission);
                  else if (item?._id || item?.id) {
                    // fall back to id; later match by name if possible
                    const id = item._id || item.id;
                    if (id) set.add(String(id));
                  }
                }
              }

              this.selectedPermissionNames.set(set);
            },
            error: (err: unknown) => {
              this.error.set((err as any)?.error?.message || 'Could not load role permissions.');
              this.toast.error(this.error());
            }
          });
        },
        error: (err: unknown) => {
          this.error.set((err as any)?.error?.message || 'Could not load permissions.');
          this.toast.error(this.error());
          this.loading.set(false);
        }
      });
  }

  isChecked(permission: PermissionItem): boolean {
    const set = this.selectedPermissionNames();

    if (permission.name && set.has(permission.name)) return true;
    if (permission._id && set.has(permission._id)) return true;
    if (permission.id && set.has(permission.id)) return true;

    return false;
  }

  togglePermission(permission: PermissionItem, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const set = new Set(this.selectedPermissionNames());
    const key = permission.name || permission._id || permission.id;
    if (!key) return;

    if (checked) set.add(key);
    else set.delete(key);

    this.selectedPermissionNames.set(set);
  }

  save(): void {
    const rid = this.roleId();
    if (!rid) return;

    this.saving.set(true);
    this.error.set('');

    // Backend expects permissionIds (not names). We map selected set back to ids.
    const ids: string[] = [];
    const selected = this.selectedPermissionNames();

    for (const p of this.allPermissions()) {
      const id = p._id ?? p.id;

      const keyCandidates = [p._id, p.id, p.name].filter(
        (v): v is string => typeof v === 'string' && v.length > 0
      );

      let isSelected = false;
      for (const k of keyCandidates) {
        if (selected.has(k)) {
          isSelected = true;
          break;
        }
      }

      if (isSelected && typeof id === 'string' && id.length > 0) {
        ids.push(id);
      }
    }

    this.adminApi.setRolePermissions(rid, { permissionIds: ids })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.toast.success('Role permissions saved successfully.'),
        error: (err: unknown) => this.toast.error((err as any)?.error?.message || 'Could not save role permissions.')
      });
  }
}
