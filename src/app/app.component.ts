import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'portfolio';
  activeSection = 'home';
  private observer!: IntersectionObserver;

  // Personal Information
  personalInfo = {
    name: 'Mohit Upadhyay',
    headline: 'Building complex dashboards, payment systems, and automation for production environments',
    description: '4+ years of full-stack experience shipping reliable systems. I specialize in turning business requirements into performant technical reality.',
    email: 'mohitu531@gmail.com',
    github: 'https://github.com/Mohitupa',
    linkedin: 'https://linkedin.com/in/mohit-upadhyay-94375b201',
    about: {
      story: "I spend my time building the systems that power real businesses. My experience isn't built on side projects, but on years of shipping code that handles actual transactions, coordinates logistics, and renders real-time analytics for active teams.\n\nI focus on the full lifecycle of a product: designing APIs that scale, building responsive frontends that manage complex state, and ensuring infrastructure is secure and monitored. I've integrated Stripe for payments, Amazon SP-API for inventory control, and Twilio for automated notifications. I work across the full stack because delivering a finished product requires understanding how every piece fits together.",
      stats: [
        { label: '4+ Years Shipping Production Code', icon: '💼' },
        { label: '10+ Systems in Active Use', icon: '🚀' },
        { label: 'Full-Stack Authority', icon: '⚡' },
        { label: 'Production Reliability', icon: '🎯' }
      ]
    }
  };

  // How I Work - Engineering Process with real-world constraints
  workSteps: WorkStep[] = [
    {
      number: '01',
      title: 'Analyze Constraints',
      description: 'Engineering is about trade-offs. Before I write code, I analyze the constraints: latency requirements, budget, timeline, and existing legacy systems. I solve the business problem first, then the technical one.',
      icon: '🔍'
    },
    {
      number: '02',
      title: 'Practical Architecture',
      description: 'I design for maintainability and scale, avoiding over-engineering. I plan the data models and API contracts to handle failure cases and edge cases that actually happen in production.',
      icon: '📐'
    },
    {
      number: '03',
      title: 'Iterative Implementation',
      description: 'I build in incremental, testable slices. Shipping a reliable MVP that solves a core problem is always better than a perfect system that never reaches the user. I document decisions to save future developers time.',
      icon: '⚙️'
    },
    {
      number: '04',
      title: 'Defensive Deployment',
      description: 'I assume things will fail. I use monitoring, logging, and rollback strategies to ensure zero-downtime deployments. A feature is only finished when it is running reliably in the hands of the user.',
      icon: '🚀'
    }
  ];

  // Tech Stack - Grouped by usage
  skills: Skill[] = [
    { name: 'Angular (4+ yr)', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'RxJS', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'REST APIs', category: 'Backend' },
    { name: 'Authentication/OAuth', category: 'Backend' },
    { name: 'MySQL', category: 'Databases' },
    { name: 'PostgreSQL', category: 'Databases' },
    { name: 'MongoDB', category: 'Databases' },
    { name: 'Stripe/Payments', category: 'Integrations' },
    { name: 'Amazon SP-API', category: 'Integrations' },
    { name: 'AWS (EC2, S3)', category: 'Cloud' }
  ];

  // Work Experience
  experience: Experience[] = [
    {
      title: 'Senior Software Engineer (Full-Stack)',
      company: 'Mango IT Solutions',
      location: 'Indore, MP, India',
      period: 'Feb 2022 – Present',
      description: 'Responsible for end-to-end delivery of business-critical applications.',
      achievements: [
        'Ownership of full-stack feature development from database schema to UI',
        'Implemented secure payment flows and third-party API integrations',
        'Optimized legacy codebase performance by 40% through query and frontend refactoring',
        'Mentored junior developers and established code review standards'
      ]
    }
  ];

  // Featured Projects with bold impact and technical challenges
  projects: Project[] = [
    {
      title: 'Anything Roatan',
      year: '2025',
      description: 'Automating logistics and payments for a high-volume booking platform.',
      image: '/anything-roatan.png',
      technologies: ['Angular', 'Node.js', 'MySQL', 'Stripe'],
      highlights: [
        'Technical: Integrated Stripe webhooks for secure payment synchronization',
        'Constraint: Handled complex concurrency in booking availability',
        '**Impact: Reduced manual overhead by 60%, processing 100+ transactions monthly**'
      ]
    },
    {
      title: 'Smart Rider',
      year: '2025',
      description: 'Real-time operational dashboard for logistics and analytics.',
      image: '/smart-rider.png',
      technologies: ['Angular', 'Node.js', 'Chart.js'],
      highlights: [
        'Technical: Optimized data aggregation for smooth 1000+ point chart rendering',
        'Constraint: Built with low-latency requirements for real-time visibility',
        '**Impact: Improved operational decision speed by providing instant data access**'
      ]
    },
    {
      title: 'FBA Inventory System',
      year: '2023',
      description: 'Enterprise-grade Amazon fulfillment and subscription management.',
      image: '/fba-system.png',
      technologies: ['Node.js', 'Angular', 'PostgreSQL', 'Amazon SP-API'],
      highlights: [
        'Technical: Built complex sync engine between Amazon SP-API and local database',
        'Constraint: Managed rate-limiting and high-availability for background jobs',
        '**Impact: Automated 40% of inventory workflows, preventing stockouts and manual errors**'
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
