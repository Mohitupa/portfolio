import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Project {
  id: string;
  year: string;
  name: string;
  description: string;
  metrics: { label: string, value: string }[];
  image: string;
  tech: string[];
  color?: string;
}

interface SkillCategory {
  category: string;
  items: string[];
  icon: string;
}

interface ImpactStat {
  label: string;
  value: string;
  extra: string;
  icon: string;
}

interface WorkStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  title = 'portfolio';
  
}
