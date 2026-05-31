import { Component } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public theme: ThemeService) { }
}
