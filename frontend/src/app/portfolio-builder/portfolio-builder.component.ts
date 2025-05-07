import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
import { PortfolioService }             from '../services/portfolio.service';
import { CommonModule, NgForOf, NgIf }  from '@angular/common';
import { FormsModule }                  from '@angular/forms';
import { MatDialog, MatDialogModule }   from '@angular/material/dialog';
import { SharesPromptComponent }        from '../shares-prompt/shares-prompt.component';

@Component({
  selector: 'app-portfolio-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './portfolio-builder.component.html',
  styleUrls: ['./portfolio-builder.component.css']
})
export class PortfolioBuilderComponent implements OnInit {
  portfolio:
    | { id: number; name: string; stocks: { ticker: string; shares: number }[] }
    | null = null;

  availableStocks: { ticker: string; name: string }[] = [];
  searchTerm = '';
  portfolioId = 0;

  readonly simStart = '2025-03-01';
  readonly simEnd   = '2025-05-02';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

    this.portfolioService.getAllStocks().subscribe({
      next: stocks => (this.availableStocks = stocks),
      error: err => console.error('Could not load stock list:', err)
    });
  }

  get filteredStocks() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.availableStocks;
    return this.availableStocks.filter(s =>
      s.ticker.toLowerCase().includes(term) ||
      s.name.toLowerCase().includes(term)
    );
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
    if (!ticker || !this.portfolio) return;

    const dialogRef = this.dialog.open(SharesPromptComponent, {
      data: { ticker },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result || result <= 0) return;

      const existing = this.portfolio!.stocks.find(s => s.ticker === ticker);
      if (existing) {
        existing.shares += result;
      } else {
        this.portfolio!.stocks.push({ ticker, shares: result });
      }

      this.portfolioService
        .updatePortfolio(this.portfolioId, this.portfolio!.stocks)
        .subscribe(() => {
          this.portfolioService
            .fetchStockHistory(ticker, this.simStart, this.simEnd)
            .subscribe({
              next: () =>
                console.log(
                  `Historical data fetched for ${ticker}`
                ),
              error: err =>
                console.error(
                  `Error fetching history for ${ticker}:`,
                  err
                )
            });
        });
    });
  }

  goToSimulation(): void {
    if (this.portfolioId) {
      this.router.navigate(['/simulate', this.portfolioId]);
    }
  }
}
