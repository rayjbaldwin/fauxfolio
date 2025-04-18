import { Component, OnInit, OnDestroy } from '@angular/core';
import { PortfolioService } from '../services/portfolio.service';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-portfolio-simulation',
  templateUrl: './portfolio-simulation.component.html',
  styleUrls: ['./portfolio-simulation.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PortfolioSimulationComponent implements OnInit, OnDestroy {
  simulationChart: Chart | null = null;
  portfolioId = 3; // I will need to fix this
  startDate = '2025-01-01';
  endDate = '2025-04-17';
  private subscription: Subscription | null = null;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.getSimulationData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.simulationChart) {
      this.simulationChart.destroy();
    }
  }

  getSimulationData(): void {
    this.subscription = this.portfolioService.simulatePortfolio(this.portfolioId, this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          this.renderChart(data.dates, data.portfolio_values);
        },
        error: (error) => {
          console.error('Error fetching simulation data', error);
        }
      });
  }

  renderChart(labels: string[], values: number[]): void {
    if (this.simulationChart) {
      this.simulationChart.destroy();
    }

    const canvas = document.getElementById('simulationChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element "simulationChart" not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2d context from canvas');
      return;
    }

    this.simulationChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Portfolio Value',
          data: values,
          fill: false,
          borderColor: 'blue',
          tension: 0.1
        }]
      },
      options: {
        responsive: true
      }
    });
  }
}
