import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStateService } from '../../../../../services/portfolio-state.service';

@Component({
  standalone: true,
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent {
  constructor(public state: PortfolioStateService) {}

  getSkillIconKey(name: string): string {
    return name.toLowerCase().replace(/[\.\s\/-]/g, '');
  }
}
