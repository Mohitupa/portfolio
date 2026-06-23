import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScrollAnimationService } from '../../../../../services/scroll-animation.service';
import { PortfolioStateService } from '../../../../../services/portfolio-state.service';
import { PortfolioApiService } from '../../../../../services/portfolio-api.service';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements AfterViewInit {
  @ViewChildren('animateOnScroll') animItems!: QueryList<ElementRef>;

  private fb = inject(FormBuilder);
  private portfolioApi = inject(PortfolioApiService);

  loading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  constructor(
    private scrollAnim: ScrollAnimationService,
    public state: PortfolioStateService
  ) {}

  ngAfterViewInit() {
    this.animItems.changes.subscribe(() => {
      this.scrollAnim.observe(this.animItems.map(el => el.nativeElement));
    });
    if (this.animItems.length > 0) {
      this.scrollAnim.observe(this.animItems.map(el => el.nativeElement));
    }
  }

  getLinkedInUrl(): string | null {
    const link = this.state.socialLinks().find(s => s.platform.toLowerCase() === 'linkedin');
    return link ? link.url : null;
  }

  isFieldInvalid(fieldName: 'name' | 'email' | 'subject' | 'message'): boolean {
    const field = this.contactForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  submitContactForm(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const payload = this.contactForm.getRawValue() as {
      name: string;
      email: string;
      subject: string;
      message: string;
    };

    this.loading.set(true);

    this.portfolioApi.sendContactMessage(payload).subscribe({
      next: (response) => {
        this.successMessage.set(response.message || 'Message sent successfully.');
        this.contactForm.reset();
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error?.error?.message || 'Could not send your message. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
