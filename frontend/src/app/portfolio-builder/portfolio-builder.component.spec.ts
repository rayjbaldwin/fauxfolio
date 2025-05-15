import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { PortfolioBuilderComponent } from './portfolio-builder.component';
import { PortfolioService } from '../services/portfolio.service';

describe('PortfolioBuilderComponent', () => {
  let component: PortfolioBuilderComponent;
  let fixture: ComponentFixture<PortfolioBuilderComponent>;
  let routeStub: any;
  let portfolioSpy: jasmine.SpyObj<PortfolioService>;

  beforeEach(async () => {
    routeStub = {
      params: of({ id: '89' }),
      snapshot: { params: { id: '89' } }
    };

    portfolioSpy = jasmine.createSpyObj('PortfolioService', [
      'getPortfolio',
      'getAllStocks'
    ]);
    portfolioSpy.getPortfolio.and.returnValue(
      of({ id: 42, name: 'Demo', stocks: [] })
    );
    portfolioSpy.getAllStocks.and.returnValue(
      of([{ ticker: 'AAPL', name: 'Apple' }])
    );

    await TestBed.configureTestingModule({
      imports: [PortfolioBuilderComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: PortfolioService, useValue: portfolioSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to route params and call getPortfolio', () => {
    expect(portfolioSpy.getPortfolio).toHaveBeenCalledWith(89);
  });

  it('should load all stocks on init', () => {
    expect(portfolioSpy.getAllStocks).toHaveBeenCalled();
  });
});
