// Creates new portfolio with name, registers it, and navigates to portfolio
import { Component } from '@angular/core';
import { PortfolioService } from '../services/portfolio.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-portfolio.component.html',
  styleUrls: ['./register-portfolio.component.css']
})
export class RegisterPortfolioComponent {
  portfolioName = '';
  errorMessage = '';

  constructor(
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private router: Router
  ) {}

  createPortfolio(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = "User not logged in.";
      return;
    }
    this.portfolioService.createPortfolio(currentUser.id, this.portfolioName).subscribe({
      next: (response) => {
        this.router.navigate(['/portfolio', response.id]);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Portfolio creation failed.';
      }
    });
  }
}
