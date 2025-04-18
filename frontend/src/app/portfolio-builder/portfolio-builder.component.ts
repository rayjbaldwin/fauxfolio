import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SharesPromptComponent } from '../shares-prompt/shares-prompt.component';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-portfolio-builder',
  standalone: true,
  imports: [CommonModule, MatDialogModule, NgForOf, NgIf],
  templateUrl: './portfolio-builder.component.html',
  styleUrls: ['./portfolio-builder.component.css']
})
export class PortfolioBuilderComponent implements OnInit {
  portfolio: { id: number; name: string; stocks: { ticker: string; shares: number }[] } | null = null;
  availableStocks = ['MSFT', 'AAPL', 'GOOG'];
  portfolioId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private portfolioService: PortfolioService,
    private dialog: MatDialog,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.portfolioId = +params['id'];
        this.loadPortfolio();
      }
    });
  }

  loadPortfolio(): void {
    this.portfolioService.getPortfolio(this.portfolioId).subscribe(data => {
      this.portfolio = data;
    });
  }

  onDragStart(event: DragEvent, ticker: string) {
    event.dataTransfer?.setData('text/plain', ticker);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const ticker = event.dataTransfer?.getData('text/plain');
    if (!ticker) return;

    const dialogRef = this.dialog.open(SharesPromptComponent, {
      data: { ticker },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result > 0) {
        if (this.portfolio) {
          const existing = this.portfolio.stocks.find(s => s.ticker === ticker);
          if (existing) {
            existing.shares += result;
          } else {
            this.portfolio.stocks.push({ ticker, shares: result });
          }
        } else {
          console.error('No portfolio loaded');
        }
      }
    });
  }
}
