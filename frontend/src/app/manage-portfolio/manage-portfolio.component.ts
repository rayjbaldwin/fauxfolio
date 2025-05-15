//Manages a users portfolio. Loads portfolios and available stocks, supports drag-and-drop to add/remove stocks, navigates to simulation

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SharesPromptComponent } from '../shares-prompt/shares-prompt.component';
import { PortfolioService } from '../services/portfolio.service';

interface PortfolioSummary { id: number; name: string; }
interface PortfolioDetail {
  id: number;
  name: string;
  stocks: { ticker: string; shares: number }[];
}
interface StockItem { ticker: string; name: string; }

@Component({
  selector: 'app-manage-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './manage-portfolio.component.html',
  styleUrls: ['./manage-portfolio.component.css']
})
export class ManagePortfolioComponent implements OnInit {
  portfolios: PortfolioSummary[] = [];
  loadingList = true;
  selectedId?: number;
  portfolio?: PortfolioDetail;
  availableStocks: StockItem[] = [];
  searchTerm = '';
  readonly simStart = '2025-03-01';
  readonly simEnd   = '2025-05-02';

  constructor(
    private portfolioService: PortfolioService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.portfolioService.getUserPortfolios().subscribe({
      next: list => {
        this.portfolios   = list;
        this.loadingList  = false;
        if (list.length > 0) {
          this.selectedId = list[0].id;
          this.selectPortfolio(this.selectedId);
        }
      },
      error: () => {
        this.portfolios   = [];
        this.loadingList  = false;
      }
    });

    this.portfolioService.getAllStocks().subscribe({
      next: stocks => this.availableStocks = stocks,
      error: err => console.error('Could not load stocks:', err)
    });
  }

  selectPortfolio(id: number) {
    this.selectedId = id;
    this.portfolio  = undefined;

    this.portfolioService.getPortfolio(id).subscribe(p => {
      this.portfolio = p;
    });
  }

  onDragOver(ev: DragEvent) {
    ev.preventDefault();
  }

  onRemoveDragStart(ev: DragEvent, ticker: string) {
    ev.dataTransfer?.setData('text/plain', `remove:${ticker}`);
  }

  onStockListDrop(ev: DragEvent) {
    ev.preventDefault();
    const data = ev.dataTransfer?.getData('text/plain');
    if (!data?.startsWith('remove:') || !this.portfolio) return;
    const ticker = data.split(':')[1];
    this.removeStock(ticker);
  }

  removeStock(ticker: string) {
    this.portfolio!.stocks = this.portfolio!.stocks.filter(s => s.ticker !== ticker);
    this.portfolioService
      .removeStock(this.selectedId!, ticker)
      .subscribe(() => {}, err => console.error('Remove failed', err));
  }

  onDragStart(ev: DragEvent, ticker: string) {
    ev.dataTransfer?.setData('text/plain', ticker);
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    const data = ev.dataTransfer?.getData('text/plain');
    if (!data || data.startsWith('remove:') || !this.portfolio) return;
    this.openSharePrompt(data);
  }

  private openSharePrompt(ticker: string, initialShares?: number) {
    const dialogRef = this.dialog.open(SharesPromptComponent, {
      data: { ticker, shares: initialShares },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result || result <= 0) return;

      const existing = this.portfolio!.stocks.find(s => s.ticker === ticker);
      if (existing) {
        existing.shares = initialShares != null ? result : existing.shares + result;
      } else {
        this.portfolio!.stocks.push({ ticker, shares: result });
      }

      this.portfolioService
        .updatePortfolio(this.selectedId!, this.portfolio!.stocks)
        .subscribe({
          next: () => {
            if (!existing) {
              this.portfolioService
                .fetchStockHistory(ticker, this.simStart, this.simEnd)
                .subscribe();
            }
          },
          error: err => console.error('Save portfolio failed', err)
        });
    });
  }

  editShares(item: { ticker: string; shares: number }) {
    this.openSharePrompt(item.ticker, item.shares);
  }

  goToSimulation() {
    this.router.navigate(['/simulate', this.selectedId]);
  }
  get filteredStocks() {
    const term = this.searchTerm.trim().toLowerCase();
    return term
      ? this.availableStocks.filter(s =>
        s.ticker.toLowerCase().includes(term) ||
        s.name.toLowerCase().includes(term)
      )
      : this.availableStocks;
  }
}
