import { Component } from '@angular/core';
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

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portfolio';

  // Personal Information
  personalInfo = {
    name: 'Mohit Upadhyay',
    title: 'Full Stack Developer',
    subtitle: 'Angular + Node.js | 4+ Years Experience',
    email: 'mohitu531@gmail.com',
    phone: '+91 8770792589',
    github: 'https://github.com/Mohitupa',
    linkedin: 'https://linkedin.com/in/mohit-upadhyay-94375b201',
    summary: 'Full Stack Developer with 4+ years of experience specializing in Angular, Node.js, and REST API development. Proven expertise in building scalable single-page applications, secure backend services, and enterprise-grade dashboards. Strong background in payment gateway integrations, cloud deployment (AWS), database optimization, and third-party API integrations.'
  };

  // Skills organized by category
  skills: Skill[] = [
    // Frontend
    { name: 'Angular', category: 'Frontend', color: '#dd0031' },
    { name: 'TypeScript', category: 'Frontend', color: '#3178c6' },
    { name: 'JavaScript', category: 'Frontend', color: '#f7df1e' },
    { name: 'RxJS', category: 'Frontend', color: '#b7178c' },
    { name: 'Angular Material', category: 'Frontend', color: '#3f51b5' },
    { name: 'HTML5', category: 'Frontend', color: '#e34f26' },
    { name: 'CSS3', category: 'Frontend', color: '#1572b6' },

    // Backend
    { name: 'Node.js', category: 'Backend', color: '#339933' },
    { name: 'Express.js', category: 'Backend', color: '#000000' },
    { name: 'REST APIs', category: 'Backend', color: '#009688' },
    { name: 'JWT', category: 'Backend', color: '#000000' },
    { name: 'OAuth 2.0', category: 'Backend', color: '#eb5424' },

    // Database
    { name: 'MySQL', category: 'Database', color: '#4479a1' },
    { name: 'PostgreSQL', category: 'Database', color: '#336791' },
    { name: 'MongoDB', category: 'Database', color: '#47a248' },

    // Tools & Integrations
    { name: 'Git', category: 'Tools', color: '#f05032' },
    { name: 'GitHub', category: 'Tools', color: '#181717' },
    { name: 'Postman', category: 'Tools', color: '#ff6c37' },
    { name: 'Swagger', category: 'Tools', color: '#85ea2d' },
    { name: 'Stripe', category: 'Integrations', color: '#635bff' },
    { name: 'Amazon SP-API', category: 'Integrations', color: '#ff9900' },
    { name: 'Google Maps API', category: 'Integrations', color: '#4285f4' },

    // Cloud & DevOps
    { name: 'AWS', category: 'Cloud', color: '#ff9900' },
    { name: 'EC2', category: 'Cloud', color: '#ff9900' },
    { name: 'S3', category: 'Cloud', color: '#569a31' },
    { name: 'RDS', category: 'Cloud', color: '#527fff' },
    { name: 'CI/CD', category: 'DevOps', color: '#2088ff' }
  ];

  // Work Experience
  experience: Experience[] = [
    {
      title: 'Software Engineer (Full Stack)',
      company: 'Mango IT Solutions',
      location: 'Indore, MP, India',
      period: 'Feb 2022 – Present',
      description: 'Leading full-stack development initiatives with focus on Angular-based UI development and REST API integration with Node.js.',
      achievements: [
        'Designed and integrated RESTful APIs, reducing average API latency by 15%',
        'Implemented secure authentication using JWT and OAuth 2.0',
        'Integrated payment gateways (Stripe, PixelPay) and third-party APIs (Amazon SP-API)',
        'Migrated legacy Angular applications to Angular 13+, improving maintainability',
        'Optimized MySQL and MongoDB queries, reducing data fetch time by 20%',
        'Mentored junior developers and conducted code reviews'
      ]
    }
  ];

  // Projects
  projects: Project[] = [
    {
      title: 'Smart Rider',
      year: '2025',
      description: 'AI-driven passenger engagement platform combining real-time transport data, interactive media, and advanced analytics to improve in-transit user retention and advertising effectiveness.',
      image: '/smart-rider.png',
      technologies: ['Angular 19', 'Node.js', 'Express', 'MongoDB', 'OpenAI API', 'Cohere AI', 'Whisper', 'JWT', 'amCharts 5', 'ECharts'],
      highlights: [
        'Architected scalable full-stack platform with modern Angular frontend',
        'Implemented intelligent content engine with OpenAI (GPT-3.5) and Cohere AI',
        'Integrated Uber API for real-time data synchronization',
        'Developed secure RBAC system with JWT authentication',
        'Created admin dashboard with amCharts 5 and ECharts for analytics'
      ]
    },
    {
      title: 'Anything Roatan',
      year: '2025',
      description: 'Multi-module tourism platform featuring Restaurants, Activities, Events, Taxi, Insurance, and Relocation modules with integrated payment processing and real-time booking.',
      image: '/anything-roatan.png',
      technologies: ['Angular', 'Ionic', 'CodeIgniter', 'Google Maps API', 'PixelPay', 'Real-time Chat'],
      highlights: [
        'Led frontend development of multi-module Angular application',
        'Integrated PixelPay payment gateway with transaction validation',
        'Built real-time taxi booking with Google Maps and fare calculation',
        'Implemented in-app chat functionality with message persistence',
        'Developed booking workflows with pricing logic and capacity management'
      ]
    },
    {
      title: 'Nimbus Data',
      year: '2024',
      description: 'Large-scale enterprise storage management UI with 100+ screens for system monitoring, configuration, and administration of storage infrastructure.',
      image: '/nimbus-data.png',
      technologies: ['Angular 19', 'Angular Material', 'RxJS', 'REST APIs', 'Laravel/Lumen', 'PHP 8.4', 'MySQL'],
      highlights: [
        'Led frontend development of 100+ screen enterprise application',
        'Designed modular Angular architecture with reusable components',
        'Developed real-time dashboards for controllers, drives, and storage metrics',
        'Implemented complex CRUD workflows with validations and bulk actions',
        'Built monitoring for snapshots, clones, replication, and system operations'
      ]
    },
    {
      title: 'FBA System',
      year: '2023',
      description: 'Fulfillment by Amazon management system with Stripe subscription model, Amazon SP-API integration, and automated product shop management.',
      image: 'https://via.placeholder.com/600x400/667eea/ffffff?text=FBA+System',
      technologies: ['Angular', 'Angular Material', 'RxJS', 'amCharts', 'Node.js', 'Express', 'PostgreSQL', 'Stripe', 'Amazon SP-API', 'AWS'],
      highlights: [
        'Engineered Stripe subscription model for payment processing',
        'Utilized Amazon SP-API for order and inventory management',
        'Reduced manual oversight by 40% through automation',
        'Implemented promocode feature for customer engagement',
        'Deployed on AWS using EC2, S3, and RDS'
      ]
    },
    {
      title: 'Digital Health I-DAIR',
      year: '2023',
      description: 'Large-scale data visualization platform for global analysis of National Digital Health Strategies with interactive charts and country comparisons.',
      image: 'https://via.placeholder.com/600x400/4facfe/ffffff?text=Digital+Health',
      technologies: ['Angular', 'Angular Material', 'RxJS', 'amCharts', 'NestJS', 'PostgreSQL'],
      highlights: [
        'Developed global health data visualization platform',
        'Implemented interactive dashboards with maps and multiple chart types',
        'Integrated REST APIs for dynamic multi-year data loading',
        'Built country-wise comparison features for health strategies',
        'Created radar, bubble, bar, and pie charts for insights'
      ]
    }
  ];

  // Education
  education = {
    degree: 'Bachelor of Engineering in Computer Science',
    institution: 'Shri Vaishnav Vidyapeeth Vishwavidyalaya',
    period: '2018 – 2022'
  };

  // Get unique skill categories
  getSkillCategories(): string[] {
    return Array.from(new Set(this.skills.map(skill => skill.category)));
  }

  // Get skills by category
  getSkillsByCategory(category: string): Skill[] {
    return this.skills.filter(skill => skill.category === category);
  }

  // Smooth scroll to section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Active section tracking
  activeSection = 'home';

  ngOnInit(): void {
    // Track active section on scroll
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        const sections = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const offsetTop = element.offsetTop;
            const offsetHeight = element.offsetHeight;

            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              this.activeSection = section;
              break;
            }
          }
        }
      });
    }
  }
}
