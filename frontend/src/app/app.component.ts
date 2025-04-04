import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PortfolioBuilderComponent} from './portfolio-builder/portfolio-builder.component';

@Component({
  selector: 'app-root',
  imports: [PortfolioBuilderComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Capstone';
}
