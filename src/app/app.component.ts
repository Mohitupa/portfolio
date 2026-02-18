import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
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

interface ProjectModule {
  category: string;
  icon: string; // SVG path
  bullets: string[];
  accent?: 'cyan' | 'amber';
}

interface Project {
  title: string;
  year: string;
  description: string;
  image: string;
  technologies: string[];
  highlights: string[];
  stats?: { label: string, value: string }[];
  modules: ProjectModule[];
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
  @ViewChild('heroCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  categoryMetadata: { [key: string]: { svg: string, color: string } } = {
    'Frontend': {
      svg: 'M2,21H22V19H2V21M12,2L5.8,11H18.2L12,2M12,5.17L14.67,9H9.33L12,5.17M1,12V14H23V12H1M2,15V18H22V15H2Z',
      color: '#00f3ff'
    },
    'Backend': {
      svg: 'M12,13A5,5 0 0,1 7,8A5,5 0 0,1 12,3A5,5 0 0,1 17,8A5,5 0 0,1 12,13M12,1L8,5H11V14H13V5H16L12,1M3,21V16H5V21H19V16H21V21A2,2 0 0,1 19,23H5A2,2 0 0,1 3,21Z',
      color: '#10b981'
    },
    'Databases': {
      svg: 'M12,2C6.48,2,2,4.24,2,7v10c0,2.76,4.48,5,10,5s10-2.24,10-5V7C22,4.24,17.52,2,12,2z M12,4c4.41,0,8,1.34,8,3s-3.59,3-8,3s-8-1.34-8-3S7.59,4,12,4z M20,17c0,1.66-3.59,3-8,3s-8-1.34-8-3v-2.35c2.18,1.44,5.43,2.35,8,2.35s5.82-0.91,8-2.35V17z M20,12.35c-2.18,1.44-5.43,2.35-8,2.35s-5.82-0.91-8-2.35V10c2.18,1.44,5.43,2.35,8,2.35s5.82-0.91,8-2.35V12.35z',
      color: '#a855f7'
    },
    'Integrations': {
      svg: 'M17,11V3H7V11H3L12,20L21,11H17M7,13V21H17V13H21L12,4L3,13H7Z',
      color: '#f59e0b'
    },
    'Cloud': {
      svg: 'M19.35,10.04C18.67,6.59,15.64,4,12,4C9.11,4,6.6,5.64,5.35,8.04C2.34,8.36,0,10.91,0,14c0,3.31,2.69,6,6,6h13c2.76,0,5-2.24,5-5C24,12.36,21.95,10.22,19.35,10.04z',
      color: '#3b82f6'
    }
  };

  socialMetadata = {
    github: 'M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.49,20.14 9.49,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.49,20.68 14.49,21C14.49,21.27 14.65,21.59 15.16,21.5C19.13,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z',
    linkedin: 'M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C13.93,9.94 13.46,10.66 13.12,11.18V10.13H10.13V18.5H13.13V13.24C13.13,12.51 13.27,11.78 14.17,11.78C15.06,11.78 15.2,12.51 15.2,13.24V18.5H18.2M8,18.5V10.13H5V18.5H8M6.5,5.5A1.5,1.5 0 0,0 5,7A1.5,1.5 0 0,0 6.5,8.5A1.5,1.5 0 0,0 8,7A1.5,1.5 0 0,0 6.5,5.5Z',
    twitter: 'M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.59,4 11.64,5.95 11.64,8.35C11.64,8.69 11.67,9.03 11.76,9.36C8.12,9.17 4.91,7.43 2.76,4.79C2.38,5.44 2.17,6.2 2.17,7C2.17,8.5 2.93,9.8 4.09,10.57C3.38,10.55 2.73,10.35 2.17,10.05V10.1C2.17,12.21 3.67,13.96 5.67,14.36C5.31,14.46 4.93,14.5 4.53,14.5C4.25,14.5 3.97,14.47 3.71,14.42C4.26,16.14 5.86,17.39 7.76,17.42C6.28,18.58 4.41,19.27 2.38,19.27C2.03,19.27 1.69,19.26 1.35,19.22C3.28,20.46 5.58,21.18 8.05,21.18C16.1,21.18 20.5,14.5 20.5,8.72C20.5,8.53 20.5,8.34 20.5,8.15C21.35,7.54 22.09,6.8 22.46,6Z'
  };

  constructor() { }

  getCategorySvg(category: string): string {
    return this.categoryMetadata[category]?.svg || '';
  }

  getCategoryColor(category: string): string {
    return this.categoryMetadata[category]?.color || '#E5533D';
  }

  getSocialSvg(platform: 'github' | 'linkedin' | 'twitter'): string {
    return this.socialMetadata[platform];
  }

  title = 'portfolio';
  isMenuOpen = false;
  activeSection = 'home';

  private observer!: IntersectionObserver;
  private animationId: number | null = null;
  private frames: HTMLImageElement[] = [];
  private currentFrame = 0;
  private lastTime = 0;
  private frameCount = 240;
  private totalScrollable = 0;
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  private mouseLerp = 0.05;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

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

  // Projects - Detailed Coverage with Modular Dashboard Data
  projects: Project[] = [
    {
      title: 'Smart Rider',
      year: '2025',
      description: 'AI-driven passenger engagement platform for real-time transport analytics.',
      image: '/smart-rider.png',
      technologies: ['Angular 19', 'Node.js', 'MongoDB', 'OpenAI'],
      highlights: [],
      stats: [
        { label: 'Retention', value: '+45%' },
        { label: 'Efficiency', value: '+30%' }
      ],
      modules: [
        {
          category: 'Architecture & AI',
          icon: 'M12,13A5,5 0 0,1 7,8A5,5 0 0,1 12,3A5,5 0 0,1 17,8A5,5 0 0,1 12,13M12,1L8,5H11V14H13V5H16L12,1',
          accent: 'cyan',
          bullets: ['Angular 19 / TypeScript', 'OpenAI GPT-3.5 Integration', 'Whisper Voice Analysis']
        },
        {
          category: 'Real-Time Metrics',
          icon: 'M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z',
          accent: 'cyan',
          bullets: ['ECharts Data Visualization', '1000+ Real-time Data Points', 'WebSocket Live Updates']
        },
        {
          category: 'Impact & Scale',
          icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M13,10V8H11V10H13M13,16V12H11V16H13Z',
          accent: 'amber',
          bullets: ['Personalized Content Engine', 'Multilingual Support', 'Scalable Transit Analytics']
        }
      ]
    },
    {
      title: 'Anything Roatan',
      year: '2025',
      description: 'Multi-module booking and logistics infrastructure for island-wide services.',
      image: '/anything-roatan.png',
      technologies: ['Angular', 'Node.js', 'Google Maps', 'PixelPay'],
      highlights: [],
      stats: [
        { label: 'Automation', value: '90%' },
        { label: 'Latency', value: '-20%' }
      ],
      modules: [
        {
          category: 'Logistics Engine',
          icon: 'M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,18H4V6h16V18z M6,8h12v2H6V8z M6,11h12v2H6V11z M6,14h8v2H6V14z',
          accent: 'cyan',
          bullets: ['PixelPay Payment Gateway', 'Real-time Booking Validation', 'Taxi Dispatch Logic']
        },
        {
          category: 'Mapping & Routing',
          icon: 'M12,2C8.13,2 5,5.13 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9C19,5.13 15.87,2 12,2M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5Z',
          accent: 'cyan',
          bullets: ['Google Maps API Integration', 'Distance-based Fare Engine', 'Live Driver Tracking']
        },
        {
          category: 'Business Impact',
          icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M13,10V8H11V10H13M13,16V12H11V16H13Z',
          accent: 'amber',
          bullets: ['Automated Island Logistics', 'Reduced Manual Oversight', 'Secure Multi-vendor Flows']
        }
      ]
    },
    {
      title: 'Nimbus Data',
      year: '2024',
      description: 'Enterprise storage management UI handling 100+ administrative modules.',
      image: '/nimbus-data.png',
      technologies: ['Angular 19', 'RxJS', 'Material', 'MySQL'],
      highlights: [],
      stats: [
        { label: 'Screens', value: '100+' },
        { label: 'Efficiency', value: '+30%' }
      ],
      modules: [
        {
          category: 'Storage Operations',
          icon: 'M2,14H8V20H2V14M10,14H16V20H10V14M18,14H24V20H18V14M2,4H8V10H2V4M10,4H16V10H10V4M18,4H24V10H18V4Z',
          accent: 'cyan',
          bullets: ['Snapshot Management', 'Replication Workflows', 'Modular SPA Architecture']
        },
        {
          category: 'System Monitoring',
          icon: 'M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z',
          accent: 'cyan',
          bullets: ['Controller Health Tracking', 'Sensor Data Aggregation', 'Real-time Alerts Engine']
        },
        {
          category: 'Impact & Scale',
          icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M13,10V8H11V10H13M13,16V12H11V16H13Z',
          accent: 'amber',
          bullets: ['100+ Administrative Screens', 'High-Availability Management', 'Unified Enterprise Storage UI']
        }
      ]
    },
    {
      title: 'FBA Inventory',
      year: '2023',
      description: 'Automated Amazon fulfillment management with subscription-based access.',
      image: '/fba-system.png',
      technologies: ['Node.js', 'Angular', 'Amazon SP-API', 'Stripe'],
      highlights: [],
      stats: [
        { label: 'Oversight', value: '-40%' },
        { label: 'Sync Rate', value: '100%' }
      ],
      modules: [
        {
          category: 'Amazon Integration',
          icon: 'M12,2l0.35,0l1.32,1.32c0.2,0.2 0.52,0.2 0.72,0l1.32,-1.32l0.35,0c0.23,0 0.45,0.09 0.61,0.25l7.07,7.07c0.16,0.16 0.25,0.38 0.25,0.61l0,0.35l-1.32,1.32c-0.2,0.2 -0.2,0.52 0,0.72l1.32,1.32l0,0.35c0,0.23 -0.09,0.45 -0.25,0.61l-7.07,7.07c-0.16,0.16 -0.38,0.25 -0.61,0.25l-0.35,0l-1.32,-1.32c-0.2,-0.2 -0.52,-0.2 -0.72,0l-1.32,1.32l-0.35,0c-0.23,0 -0.45,-0.09 -0.61,-0.25l-7.07,-7.07c-0.16,-0.16 -0.25,-0.38 -0.25,-0.61l0,-0.35l1.32,-1.32c0.2,-0.2 0.2,-0.52 0,-0.72l-1.32,-1.32l0,-0.35c0,-0.23 0.09,-0.45 0.25,-0.61l7.07,-7.07c0.16,-0.16 0.38,-0.25 0.61,-0.25Z',
          accent: 'cyan',
          bullets: ['Amazon SP-API Integration', 'Sync Engine (Node.js Jobs)', 'Automatic Inventory Tracking']
        },
        {
          category: 'Subscription Model',
          icon: 'M21,18H24V20H21V18M19,10V14H21V10H19M19,16V18H21V16H19M3,20V4H17V9H19V4A2,2 0 0,0 17,2H3A2,2 0 0,0 1,4V20A2,2 0 0,0 3,22H17V20H3M6,6V8H14V6H6M6,10V12H14V10H6M6,14V16H10V14H6Z',
          accent: 'cyan',
          bullets: ['Stripe Recurring Billing', 'User Access Management', 'Financial Webhooks']
        },
        {
          category: 'Operational Impact',
          icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M13,10V8H11V10H13M13,16V12H11V16H13Z',
          accent: 'amber',
          bullets: ['40% Less Manual Oversight', 'Automated FBA Syncing', 'Enterprise Inventory Scale']
        }
      ]
    },
    {
      title: 'I-DAIR Health',
      year: '2023',
      description: 'Global health data visualization platform enabling multi-country analysis.',
      image: '/digital-health.png',
      technologies: ['Angular', 'NestJS', 'amCharts', 'PostgreSQL'],
      highlights: [],
      stats: [
        { label: 'Countries', value: '50+' },
        { label: 'Data Points', value: '1M+' }
      ],
      modules: [
        {
          category: 'Data Visualization',
          icon: 'M3,13H9V19H3V13M11,5H17V19H11V5M19,10H25V19H19V10Z',
          accent: 'cyan',
          bullets: ['amCharts Complex Analysis', 'Radar & Bubble Chart Models', 'Multi-year Trend Loading']
        },
        {
          category: 'Backend Services',
          icon: 'M12,1L8,5H11V14H13V5H16L12,1M3,21V16H5V21H19V16H21V21A2,2 0 0,1 19,23H5A2,2 0 0,1 3,21Z',
          accent: 'cyan',
          bullets: ['NestJS Data Aggregators', 'PostgreSQL Multi-country Data', 'API Design for Scale']
        },
        {
          category: 'Global Impact',
          icon: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M13,10V8H11V10H13M13,16V12H11V16H13Z',
          accent: 'amber',
          bullets: ['50+ Country Analysis', 'Global Health Strategy Tool', 'Multi-year Insight Graphing']
        }
      ]
    }
  ];

  @HostListener('window:scroll')
  onWindowScroll() {
    // Programmatic scroll tracking is now handled directly in renderCanvas for zero-lag sync
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeCanvas();
    this.updateScrollDimensions();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // Standardize to -0.5 to 0.5 range
    this.targetMouseX = (event.clientX / window.innerWidth) - 0.5;
    this.targetMouseY = (event.clientY / window.innerHeight) - 0.5;
  }

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
      this.activeSection = sectionId; // Immediate feedback for clicks
      this.isMenuOpen = false;
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
    this.preloadFrames();
    this.setupScrollAnimations();
    this.setupSectionObserver();
    this.updateScrollDimensions();
    this.initCanvasAnimation();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private preloadFrames() {
    for (let i = 1; i <= this.frameCount; i++) {
      const img = new Image();
      const num = i.toString().padStart(3, '0');
      img.src = `/animation/ezgif-frame-${num}.jpg`;
      this.frames.push(img);
    }
  }

  private initCanvasAnimation() {
    const canvas = this.canvasRef.nativeElement;
    this.resizeCanvas();

    const animate = (time: number) => {
      this.renderCanvas(time);
      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  private resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private updateScrollDimensions() {
    this.totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
  }

  private renderCanvas(time: number) {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx || this.totalScrollable <= 0) return;

    // Direct scroll sync for the frame index to reduce lag
    const immediateScrollY = window.scrollY;
    const scrollFraction = Math.max(0, Math.min(1, immediateScrollY / this.totalScrollable));

    // Map scroll fraction to frame index
    const targetFrame = scrollFraction * (this.frameCount - 1);

    // Smooth frame transition: extremely heavy lerp for ultimate luxury
    this.currentFrame += (targetFrame - this.currentFrame) * 0.08;

    // Smooth mouse interpolation: very slow follow for "weightless" feel
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.03;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.03;

    // Apply 3D transformation to foreground via CSS variables or direct DOM manipulation
    // We use CSS variables for performance as it doesn't trigger full layout reloads
    document.documentElement.style.setProperty('--mouse-x', `${this.mouseX}`);
    document.documentElement.style.setProperty('--mouse-y', `${this.mouseY}`);

    const displayFrame = Math.round(this.currentFrame);
    const img = this.frames[displayFrame];

    // Performance: Skip rendering if frame not ready
    if (!img || !img.complete) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Global Anti-gravity Parallax & Drift
    // Use immediate scroll for parallax to maintain perfect sync with page content
    const parallaxOffset = immediateScrollY * 0.08;
    const floatingOffset = Math.sin(time * 0.001) * 12;

    // Draw Image with coverage logic
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.width / img.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasAspect > imgAspect) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgAspect;
      drawHeight = canvas.height;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    // REMOVED: Modulus snap. Use linear offset for a continuous motion.
    const finalY = offsetY - parallaxOffset + floatingOffset;

    ctx.globalAlpha = 1.0;
    ctx.drawImage(img, Math.floor(offsetX), Math.floor(finalY), Math.floor(drawWidth), Math.floor(drawHeight));
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
    // Include both header and sections. Home is usually the header[id="home"]
    const sections = document.querySelectorAll('header[id], section[id]');

    const observerOptions = {
      // Trigger when the section occupies a significant part of the viewport
      threshold: 0.4,
      rootMargin: '-80px 0px 0px 0px' // Offset for possible fixed header height
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // We only care about sections entering the view
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, observerOptions);

    sections.forEach(section => this.observer.observe(section));
  }
}
