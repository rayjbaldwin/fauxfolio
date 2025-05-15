import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ManagePortfolioComponent } from './manage-portfolio.component';
import { PortfolioService } from '../services/portfolio.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

describe('ManagePortfolioComponent', () => {
  let component: ManagePortfolioComponent;
  let fixture: ComponentFixture<ManagePortfolioComponent>;

  let portfolioSpy: jasmine.SpyObj<PortfolioService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    portfolioSpy = jasmine.createSpyObj('PortfolioService', [
      'getUserPortfolios',
      'getAllStocks',
      'getPortfolio',
      'removeStock',
      'updatePortfolio',
      'fetchStockHistory'
    ]);
    portfolioSpy.getUserPortfolios.and.returnValue(of([]));
    portfolioSpy.getAllStocks.and.returnValue(of([]));

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ManagePortfolioComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy  },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filteredStocks returns all stocks when searchTerm is empty', () => {
    component.availableStocks = [
      { ticker: 'AAPL', name: 'Apple' },
      { ticker: 'MSFT', name: 'Microsoft' }
    ];
    component.searchTerm = '';
    expect(component.filteredStocks).toEqual(component.availableStocks);
  });

  it('filteredStocks filters stocks based on searchTerm', () => {
    component.availableStocks = [
      { ticker: 'AAPL', name: 'Apple' },
      { ticker: 'MSFT', name: 'Microsoft' }
    ];
    component.searchTerm = 'app';
    expect(component.filteredStocks).toEqual([
      { ticker: 'AAPL', name: 'Apple' }
    ]);
    component.searchTerm = 'soft';
    expect(component.filteredStocks).toEqual([
      { ticker: 'MSFT', name: 'Microsoft' }
    ]);
  });

  it('goToSimulation navigates to simulate route with selectedId', () => {
    component.selectedId = 42;
    component.goToSimulation();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/simulate', 42]);
  });
});
