import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

interface PortfolioSummary {
  id: number;
  name: string;
}

@Component({
  selector: 'app-portfolio-simulation',
  standalone: true,
  imports: [CommonModule, FormsModule, NgForOf, NgIf],
  templateUrl: './portfolio-simulation.component.html',
  styleUrls: ['./portfolio-simulation.component.css']
})
export class PortfolioSimulationComponent implements OnInit, OnDestroy {
  portfolios: PortfolioSummary[] = [];
  selectedId!: number;
  private subscription: Subscription | null = null;
  simulationChart: Chart | null = null;

  startDate = '2025-03-03';
  endDate = '2025-05-02';

  constructor(
    private route: ActivatedRoute,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.portfolioService.getUserPortfolios().subscribe({
      next: list => {
        this.portfolios = list;
        const paramId = this.route.snapshot.params['id'];
        this.selectedId = paramId ? +paramId : list[0]?.id;
        this.runSimulation();
      },
      error: err => console.error('Could not load portfolios:', err)
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.simulationChart?.destroy();
  }

  runSimulation(): void {
    if (!this.selectedId) return;
    this.subscription?.unsubscribe();

    this.subscription = this.portfolioService
      .simulatePortfolio(this.selectedId, this.startDate, this.endDate)
      .subscribe({
        next: data => this.renderChart(data.dates, data.portfolio_values),
        error: err => console.error('Simulation error:', err)
      });
  }

  private renderChart(labels: string[], values: number[]): void {
    if (this.simulationChart) {
      this.simulationChart.destroy();
    }
    const first = values[0] ?? 0;
    const last  = values[values.length - 1] ?? 0;
    const trendColor = last >= first ? '#4CD863' : '#FE3B2F';

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
        labels,
        datasets: [{
          label: 'Portfolio Value',
          data: values,
          fill: false,
          borderColor: trendColor,
          pointBackgroundColor: trendColor,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: '$'
            },
            }
          }
        }
    });
  }
}
