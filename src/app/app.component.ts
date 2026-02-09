import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  category: string;
  color: string;
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
    greeting: 'Mohit Upadhyay',
    headline: 'I build dashboards, payment systems, and backend APIs used by real businesses',
    description: '4+ years shipping production systems. Angular frontends, Node.js backends, third-party integrations, AWS deployments. I have handled Stripe subscriptions, real-time analytics, logistics automation, and database optimization at scale.',
    email: 'mohitu531@gmail.com',
    phone: '+91 8770792589',
    github: 'https://github.com/Mohitupa',
    linkedin: 'https://linkedin.com/in/mohit-upadhyay-94375b201',
    about: {
      story: "I have spent 4+ years building systems that handle real money, real users, and real deadlines. Not side projects — production applications that businesses depend on daily.\n\nI have built booking platforms processing payments, analytics dashboards rendering thousands of data points, logistics systems coordinating operations across teams, and backend APIs serving mobile apps. I have integrated Stripe for subscriptions, Amazon SP-API for inventory, Twilio for notifications, and Google Maps for location services.\n\nI work across the full stack because that is what shipping requires. I write Angular components, design REST APIs, optimize database queries, debug production issues, and deploy to AWS. I have learned that good engineering is not about using every new framework — it is about solving problems reliably with tools that work.",
      stats: [
        { label: '4+ Years Shipping Production Code', icon: '💼' },
        { label: '10+ Systems in Active Use', icon: '🚀' },
        { label: 'Full-Stack: Frontend to Database', icon: '⚡' },
        { label: 'Real Revenue, Real Users', icon: '🎯' }
      ]
    }
  };

  // How I Work - Engineering Process
  workSteps: WorkStep[] = [
    {
      number: '01',
      title: 'Understand the Constraints',
      description: 'Before writing code, I figure out what actually matters. Budget, timeline, existing systems, team capacity. I ask questions until I understand the trade-offs. Fast vs. perfect. Build vs. buy. Custom vs. off-the-shelf.',
      icon: '🔍'
    },
    {
      number: '02',
      title: 'Design for Reality',
      description: 'I plan for the system we can actually build and maintain. Not the ideal architecture from a textbook, but one that works with our database, our deployment process, our team skills. I think through failure cases early.',
      icon: '📐'
    },
    {
      number: '03',
      title: 'Build Incrementally',
      description: 'I ship features in pieces. Get something working, deploy it, get feedback, iterate. I have learned that a working MVP beats a perfect system that is three months late. I write tests for critical paths and document non-obvious decisions.',
      icon: '⚙️'
    },
    {
      number: '04',
      title: 'Deploy with Confidence',
      description: 'I have debugged enough production issues to know what can go wrong. I check logs, monitor error rates, test edge cases. I deploy during low-traffic hours when possible. I keep rollback plans ready. I do not assume it works until users confirm it works.',
      icon: '🚀'
    },
    {
      number: '05',
      title: 'Fix What Breaks',
      description: 'Production systems break. APIs timeout. Databases slow down. Users do unexpected things. I have learned to fix issues fast, understand root causes, and prevent them from happening again. Good engineering is as much about maintenance as building.',
      icon: '🔄'
    }
  ];

  // Skills organized by category
  skills: Skill[] = [
    // Frontend
    { name: 'Angular (4+ years)', category: 'Frontend', color: '#dd0031' },
    { name: 'TypeScript', category: 'Frontend', color: '#3178c6' },
    { name: 'RxJS', category: 'Frontend', color: '#b7178c' },
    { name: 'Tailwind CSS', category: 'Frontend', color: '#06b6d4' },
    { name: 'HTML5, CSS3', category: 'Frontend', color: '#e34f26' },

    // Backend
    { name: 'Node.js', category: 'Backend', color: '#339933' },
    { name: 'Express.js', category: 'Backend', color: '#000000' },
    { name: 'Laravel', category: 'Backend', color: '#ff2d20' },
    { name: 'REST APIs', category: 'Backend', color: '#009688' },
    { name: 'Authentication & Authorization', category: 'Backend', color: '#6366f1' },

    // Databases
    { name: 'MySQL', category: 'Databases', color: '#4479a1' },
    { name: 'MongoDB', category: 'Databases', color: '#47a248' },
    { name: 'PostgreSQL', category: 'Databases', color: '#336791' },

    // Cloud & DevOps
    { name: 'AWS (EC2, S3, SES)', category: 'Cloud & DevOps', color: '#ff9900' },
    { name: 'Docker', category: 'Cloud & DevOps', color: '#2496ed' },
    { name: 'CI/CD Pipelines', category: 'Cloud & DevOps', color: '#2088ff' },

    // Integrations
    { name: 'Stripe', category: 'Integrations', color: '#635bff' },
    { name: 'Twilio', category: 'Integrations', color: '#f22f46' },
    { name: 'ShipStation', category: 'Integrations', color: '#4a90e2' },
    { name: 'Google Maps API', category: 'Integrations', color: '#4285f4' }
  ];

  // Work Experience
  experience: Experience[] = [
    {
      title: 'Software Engineer – Full Stack',
      company: 'Mango IT Solutions',
      location: 'Indore, MP, India',
      period: 'Feb 2022 – Present',
      description: 'Building production-grade web applications used by real businesses and end users.',
      achievements: [
        'Built and maintained scalable web applications used in production',
        'Designed REST APIs and integrated third-party services',
        'Collaborated with designers, product managers, and QA teams',
        'Improved system performance and reliability through optimization'
      ]
    }
  ];

  // Featured Projects
  projects: Project[] = [
    {
      title: 'Anything Roatan',
      year: '2025',
      description: 'Full-stack booking and payment platform handling real customer transactions',
      image: '/anything-roatan.png',
      technologies: ['Angular', 'Node.js', 'MySQL', 'AWS', 'Stripe'],
      highlights: [
        '**Impact:** Cut manual booking operations by 60%, now processing 100+ bookings/month',
        '**Challenge:** Integrated Stripe for secure payment processing with proper error handling and webhook validation',
        '**Scale:** Built REST APIs serving Angular frontend, deployed on AWS with automated backups',
        'Handles booking conflicts, payment failures, and email notifications reliably'
      ]
    },
    {
      title: 'Smart Rider',
      year: '2025',
      description: 'Real-time analytics dashboard processing operational data for decision-making',
      image: '/smart-rider.png',
      technologies: ['Angular', 'Node.js', 'Chart.js', 'REST APIs'],
      highlights: [
        '**Impact:** Gave operations team real-time visibility into metrics that were previously manual',
        '**Challenge:** Optimized database queries and API responses to render charts with 1000+ data points smoothly',
        '**Scale:** Built dynamic filtering system allowing users to drill down into specific time ranges and categories',
        'Reduced page load time from 8s to under 2s through query optimization and caching'
      ]
    },
    {
      title: 'Nimbus Data',
      year: '2024',
      description: 'Backend system handling large dataset processing and API delivery',
      image: '/nimbus-data.png',
      technologies: ['Node.js', 'MySQL', 'AWS'],
      highlights: [
        '**Impact:** Improved query performance by 40% through database indexing and query optimization',
        '**Challenge:** Designed scalable API architecture to handle growing data volume without performance degradation',
        '**Scale:** Processes 10,000+ records daily with proper error handling and retry logic',
        'Built with AWS deployment, monitoring, and automated scaling'
      ]
    },
    {
      title: 'FBA System',
      year: '2023',
      description: 'Amazon fulfillment management with Stripe subscriptions and SP-API integration',
      image: 'https://via.placeholder.com/600x400/667eea/ffffff?text=FBA+System',
      technologies: ['Angular', 'Node.js', 'PostgreSQL', 'Stripe', 'Amazon SP-API', 'AWS'],
      highlights: [
        '**Impact:** Reduced manual oversight by 40% through automated inventory sync and order management',
        '**Challenge:** Integrated Amazon SP-API for real-time inventory updates and Stripe for recurring billing',
        '**Scale:** Handles subscription management, promocodes, and automated product shop workflows',
        'Deployed on AWS with proper database backups and monitoring'
      ]
    },
    {
      title: 'Digital Health I-DAIR',
      year: '2023',
      description: 'Healthcare platform managing patient data with security and compliance',
      image: 'https://via.placeholder.com/600x400/667eea/ffffff?text=Digital+Health',
      technologies: ['Angular', 'Node.js', 'MongoDB', 'AWS'],
      highlights: [
        '**Impact:** Provided secure platform for healthcare workflows with role-based access control',
        '**Challenge:** Implemented HIPAA-compliant data handling with proper encryption and audit logs',
        '**Scale:** Built with high availability on AWS, ensuring 99.9% uptime for critical healthcare operations',
        'Integrated with healthcare APIs while maintaining data security and privacy'
      ]
    }
  ];

  // Utility Methods
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

  // Lifecycle hooks
  ngAfterViewInit() {
    this.setupScrollAnimations();
    this.setupSectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // Setup scroll-triggered animations
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

    // Observe all animated elements
    setTimeout(() => {
      const elements = document.querySelectorAll('.fade-in-up, .stagger-item');
      elements.forEach(el => animationObserver.observe(el));
    }, 100);
  }

  // Setup section observer for active nav
  private setupSectionObserver() {
    const sections = document.querySelectorAll('section[id]');

    const observerOptions = {
      threshold: 0.3
    };

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
