import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../services/portfolio.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-choose-adventure',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './choose-adventure.component.html',
  styleUrls: ['./choose-adventure.component.css']
})
export class ChooseAdventureComponent implements OnInit {
  formVisible = false;
  portfolios : { id: number; name: string }[] = [];
  loading = true;
  portfolioName = '';
  errorMessage  = '';

  constructor(
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    setTimeout(() => this.formVisible = true, 0);
    this.portfolioService.getUserPortfolios().subscribe({
      next: list => {
        this.portfolios = list;
        this.loading    = false;
      },
      error: () => {
        this.portfolios = [];
        this.loading    = false;
      }
    });
  }

  createPortfolio(): void {
    this.errorMessage = '';
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.errorMessage = 'User not logged in.';
      return;
    }
    this.portfolioService.createPortfolio(user.id, this.portfolioName)
      .subscribe({
        next: (response: { id: number }) => {
          this.router.navigate(['/portfolio', response.id]);
        },
        error: err => {
          this.errorMessage = err.error?.message || 'Portfolio creation failed.';
        }
      });
  }

  viewExisting() {
    if (this.portfolios.length > 0) {
      this.router.navigate(['/portfolio-list']);
    }
  }
}
