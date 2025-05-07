import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SharesPromptComponent } from '../shares-prompt/shares-prompt.component';
import { PortfolioService } from '../services/portfolio.service';

@Component({
  selector: 'app-portfolio-builder',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatDialogModule, NgForOf, NgIf ],
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
  readonly simEnd = '2025-05-02';

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
      next: stocks => this.availableStocks = stocks,
      error: err => console.error(err)
    });
  }

  get filteredStocks() {
    const t = this.searchTerm.trim().toLowerCase();
    return t
      ? this.availableStocks.filter(s =>
        s.ticker.toLowerCase().includes(t) ||
        s.name.toLowerCase().includes(t)
      )
      : this.availableStocks;
  }

  loadPortfolio() {
    this.portfolioService.getPortfolio(this.portfolioId).subscribe(p => this.portfolio = p);
  }

  onDragStart(ev: DragEvent, ticker: string) {
    ev.dataTransfer?.setData('text/plain', ticker);
  }
  onRemoveDragStart(ev: DragEvent, ticker: string) {
    ev.dataTransfer?.setData('text/plain', `remove:${ticker}`);
  }
  onDragOver(ev: DragEvent) {
    ev.preventDefault();
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    const data = ev.dataTransfer?.getData('text/plain');
    if (!data || data.startsWith('remove:')) return;
    this.openSharePrompt(data);
  }

  onStockListDrop(ev: DragEvent) {
    ev.preventDefault();
    const data = ev.dataTransfer?.getData('text/plain');
    if (data?.startsWith('remove:')) {
      const ticker = data.split(':')[1];
      this.removeStock(ticker);
    }
  }

  private openSharePrompt(ticker: string, initialShares?: number) {
    const dialogRef = this.dialog.open(SharesPromptComponent, {
      data: { ticker, shares: initialShares },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result || result <= 0 || !this.portfolio) return;

      const existing = this.portfolio.stocks.find(s => s.ticker === ticker);
      if (existing) {
        existing.shares = initialShares != null ? result : existing.shares + result;
      } else {
        this.portfolio.stocks.push({ ticker, shares: result });
      }

      this.portfolioService
        .updatePortfolio(this.portfolioId, this.portfolio.stocks)
        .subscribe(() => {
          if (!existing) {
            this.portfolioService.fetchStockHistory(ticker, this.simStart, this.simEnd)
              .subscribe();
          }
        });
    });
  }

  removeStock(ticker: string) {
    if (!this.portfolio) return;
    this.portfolio.stocks = this.portfolio.stocks.filter(s => s.ticker !== ticker);

    this.portfolioService
      .removeStock(this.portfolioId, ticker)
      .subscribe();
  }

  editShares(item: { ticker: string; shares: number }) {
    this.openSharePrompt(item.ticker, item.shares);
  }

  goToSimulation() {
    this.router.navigate(['/simulate', this.portfolioId]);
  }
}
