import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SharesPromptComponent } from '../shares-prompt/shares-prompt.component'; // adjust the path as needed

@Component({
  selector: 'app-portfolio-builder',
  standalone: true,
  imports: [CommonModule, MatDialogModule], // add other needed modules here
  templateUrl: './portfolio-builder.component.html',
  styleUrls: ['./portfolio-builder.component.css']
})
export class PortfolioBuilderComponent {
  stocks = ['AAPL', 'TSLA', 'NVDA', 'GOOGL'];
  portfolio: { ticker: string; shares: number }[] = [];

  constructor(private dialog: MatDialog) {}

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

    // Open the Angular Material dialog
    const dialogRef = this.dialog.open(SharesPromptComponent, {
      data: { ticker },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result > 0) {
        const existing = this.portfolio.find(s => s.ticker === ticker);
        if (existing) {
          existing.shares += result;
        } else {
          this.portfolio.push({ ticker, shares: result });
        }
      }
    });
  }
}
