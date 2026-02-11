import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Skill {
  name: string;
  category: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
}

interface Project {
  title: string;
  year: string;
  description: string;
  image: string;
  technologies: string[];
  highlights: string[];
}

interface WorkStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
  selectedTags: string[];
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'portfolio';
  activeSection = 'home';
  private observer!: IntersectionObserver;

  // Contact Form State
  contactForm: ContactForm = {
    name: '',
    email: '',
    message: '',
    selectedTags: []
  };

  availableTags = ['Hiring / Opportunity', 'Project Collaboration'];

  // Personal Information
  personalInfo = {
    name: 'Mohit Upadhyay',
    headline: 'High-performance Dashboards, Payment Systems, and AI-powered Automation',
    highlight: 'build for production',
    description: '4+ years of Full-Stack experience building enterprise-grade SPAs and secure backend services. Specialized in Angular, Node.js, and production-scale architectures.',
    email: 'mohitu531@gmail.com',
    github: 'https://github.com/Mohitupa',
    linkedin: 'https://linkedin.com/in/mohit-upadhyay-94375b201',
    about: {
      story: "I specialize in building systems that handle complexity at scale. My work focuses on bridging the gap between sophisticated business requirements and reliable engineering implementations. I've spent the last 4+ years in production environments, moving past side projects into the world of active transaction processing, real-time analytics, and enterprise logistics.\n\nFrom architecting AI-driven engagement platforms with OpenAI to designing secure multi-module payment workflows, my approach is rooted in ownship. I work best when I can own the full implementation—from designing normalized database schemas and high-performance REST APIs to crafting responsive, accessible UIs in Angular. I believe code is only finished when it is running reliably in the hands of the user, meeting production constraints head-on.",
      stats: [
        { label: '4+ Years Production Experience', icon: '💼' },
        { label: '10+ Commercial Engagements', icon: '🚀' },
        { label: 'Full-Stack Authority', icon: '⚡' },
        { label: 'Cloud-Native Delivery', icon: '🎯' }
      ]
    }
  };

  // How I Work - Engineering Process with real-world constraints
  workSteps: WorkStep[] = [
    {
      number: '01',
      title: 'Analyze Constraints & Latency',
      description: 'I analyze technical debt, latency requirements, and existing infrastructure. Before code is written, I ensure the solution scales with production data volumes and integrates seamlessly with legacy systems.',
      icon: '🔍'
    },
    {
      number: '02',
      title: 'Practical Architecture',
      description: 'I design APIs and schemas for security and maintainability. I prioritize RBAC, JWT security, and normalized data models to handle edge cases and high-concurrency scenarios effectively.',
      icon: '📐'
    },
    {
      number: '03',
      title: 'Iterative, Reliable Delivery',
      description: 'I build in testable slices, focusing on performance tuning and unit testing early. I ensure documentation is clear for future maintenance, focusing on shipping value without over-engineering.',
      icon: '⚙️'
    },
    {
      number: '04',
      title: 'Production Resilience',
      description: 'I assume failure and design for zero-downtime. Through logging, monitoring, and proactive deployments, I ensure systems remain stable and performant under real-world load.',
      icon: '🚀'
    }
  ];

  // Tech Stack - Grouped by usage and depth
  skills: Skill[] = [
    { name: 'Angular – Large-scale Enterprise SPAs & Dashboards', category: 'Frontend' },
    { name: 'TypeScript & RxJS – Complex State Management', category: 'Frontend' },
    { name: 'Angular Material – Design System Implementation', category: 'Frontend' },
    { name: 'Node.js – High-performance REST APIs & Integrations', category: 'Backend' },
    { name: 'Express & NestJS – Scalable Backend Architectures', category: 'Backend' },
    { name: 'Auth & Security (JWT, OAuth 2.0, RBAC)', category: 'Backend' },
    { name: 'MySQL & PostgreSQL – Query Optimization & Schema Design', category: 'Databases' },
    { name: 'MongoDB – Real-time Analytics & Aggregation', category: 'Databases' },
    { name: 'Payments – Stripe & PixelPay Production Webhooks', category: 'Integrations' },
    { name: 'Amazon SP-API – Automated Inventory & Order Sync', category: 'Integrations' },
    { name: 'AI Integrations – OpenAI, Cohere, and Whisper', category: 'Integrations' },
    { name: 'AWS – EC2, S3, and RDS Infrastructure Management', category: 'Cloud' },
    { name: 'CI/CD – Automated Deployments & Version Control', category: 'Cloud' }
  ];

  // Work Experience
  experience: Experience[] = [
    {
      title: 'Software Engineer (Full-Stack)',
      company: 'Mango IT Solutions',
      location: 'Indore, MP, India',
      period: 'Feb 2022 – Present',
      description: 'Responsible for end-to-end delivery of business-critical systems and mentoring.',
      achievements: [
        'Ownership of full-stack feature development, reducing average API latency by 15%',
        'Architected and integrated secure payment flows (Stripe, PixelPay) and enterprise integrations (Amazon SP-API)',
        'Led migration of legacy applications to modern Angular 13+, improving system maintainability and UX',
        'Optimized data fetch performance by 20% through MySQL/MongoDB query tuning and indexing',
        'Mentored junior engineers and conducted code reviews to maintain high quality standards'
      ]
    }
  ];

  // Projects - Detailed Coverage
  projects: Project[] = [
    {
      title: 'Smart Rider',
      year: '2025',
      description: 'AI-driven passenger engagement platform for real-time transport analytics.',
      image: '/smart-rider.png',
      technologies: ['Angular 19', 'Node.js', 'MongoDB', 'OpenAI'],
      highlights: [
        'Technical: Integrated OpenAI GPT-3.5 and Whisper for voice-based multilingual interactions',
        'Complexity: Built an admin dashboard with ECharts for real-time tracking of 1000+ data points',
        '**Impact: Improved transit retention through AI-powered personalized content delivery**'
      ]
    },
    {
      title: 'Anything Roatan',
      year: '2025',
      description: 'Multi-module booking and logistics infrastructure for island-wide services.',
      image: '/anything-roatan.png',
      technologies: ['Angular', 'Node.js', 'Google Maps', 'PixelPay'],
      highlights: [
        'technical: Integrated PixelPay for activities, events, and taxi bookings with real-time validation',
        'Complexity: Built distance-based fare calculation engine with Google Maps API integration',
        '**Impact: Automated taxi booking and payment confirmation flows for island-wide logistics**'
      ]
    },
    {
      title: 'Nimbus Data',
      year: '2024',
      description: 'Enterprise storage management UI handling 100+ administrative modules.',
      image: 'https://via.placeholder.com/600x400/161A22/E6E8EB?text=Nimbus+Data',
      technologies: ['Angular 19', 'RxJS', 'Material', 'MySQL'],
      highlights: [
        'Technical: Modular architecture handling complex storage operations (Snapshots, Replication)',
        'Scale: Designed dashboards for real-time monitoring of controllers, frames, and sensors',
        '**Impact: Delivered a unified management interface for high-availability enterprise storage**'
      ]
    },
    {
      title: 'FBA Inventory System',
      year: '2023',
      description: 'Automated Amazon fulfillment management with subscription-based access.',
      image: 'https://via.placeholder.com/600x400/161A22/E6E8EB?text=FBA+System',
      technologies: ['Node.js', 'Angular', 'Amazon SP-API', 'Stripe'],
      highlights: [
        'Technical: Built sync engine between Amazon SP-API and local database via Node.js jobs',
        'Integration: Engineered Stripe subscription model for automated recurring billing',
        '**Impact: Reduced manual inventory oversight by 40% through automated SP-API sync**'
      ]
    },
    {
      title: 'Digital Health I-DAIR',
      year: '2023',
      description: 'Global health data visualization platform enabling multi-country analysis.',
      image: 'https://via.placeholder.com/600x400/161A22/E6E8EB?text=I-DAIR+Health',
      technologies: ['Angular', 'NestJS', 'amCharts', 'PostgreSQL'],
      highlights: [
        'Technical: Implemented complex radar and bubble charts for multi-year health trend analysis',
        'Data: Integrated dynamic multi-year data loading via NestJS backend services',
        '**Impact: Enabled global health organizations to visualize development strategies across 50+ countries**'
      ]
    }
  ];

  getSkillCategories(): string[] {
    return [...new Set(this.skills.map(skill => skill.category))];
  }

  getSkillsByCategory(category: string): Skill[] {
    return this.skills.filter(skill => skill.category === category);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleTag(tag: string): void {
    const index = this.contactForm.selectedTags.indexOf(tag);
    if (index > -1) {
      this.contactForm.selectedTags.splice(index, 1);
    } else {
      this.contactForm.selectedTags.push(tag);
    }
  }

  isTagSelected(tag: string): boolean {
    return this.contactForm.selectedTags.includes(tag);
  }

  sendMessage(): void {
    console.log('Sending message:', this.contactForm);
    // In a real app, this would call a backend service
    alert('Thank you for reaching out! I will get back to you soon.');
    // Reset form
    this.contactForm = {
      name: '',
      email: '',
      message: '',
      selectedTags: []
    };
  }

  ngAfterViewInit() {
    this.setupScrollAnimations();
    this.setupSectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    setTimeout(() => {
      const elements = document.querySelectorAll('.fade-in-up, .stagger-item');
      elements.forEach(el => animationObserver.observe(el));
    }, 100);
  }

  private setupSectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = { threshold: 0.3 };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, observerOptions);

    sections.forEach(section => this.observer.observe(section));
  }
}
