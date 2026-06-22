import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  returnUrl: string = '/admin/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // If already logged in, redirect straight to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Get return url from route parameters or default to '/admin/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message || 'Invalid email or password. Please try again.'
        );
        this.loading.set(false);
      }
    });
  }
}
