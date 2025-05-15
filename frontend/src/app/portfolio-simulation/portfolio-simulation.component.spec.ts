import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { PortfolioSimulationComponent } from './portfolio-simulation.component';
import { PortfolioService } from '../services/portfolio.service';

describe('PortfolioSimulationComponent', () => {
  let component: PortfolioSimulationComponent;
  let fixture: ComponentFixture<PortfolioSimulationComponent>;
  let routeStub: any;
  let portfolioSpy: jasmine.SpyObj<PortfolioService>;

  beforeEach(async () => {
    routeStub = { snapshot: { params: { id: '123' } } };
    portfolioSpy = jasmine.createSpyObj('PortfolioService', [
      'getUserPortfolios',
      'simulatePortfolio'
    ]);
    portfolioSpy.getUserPortfolios.and.returnValue(of([{ id: 123, name: 'Test' }]));
    portfolioSpy.simulatePortfolio.and.returnValue(of({
      dates: ['2025-03-03', '2025-03-04'],
      portfolio_values: [100, 105]
    }));

    await TestBed.configureTestingModule({
      imports: [PortfolioSimulationComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: PortfolioService, useValue: portfolioSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioSimulationComponent);
    component = fixture.componentInstance;

    spyOn(component as any, 'renderChart').and.callFake((labels: string[], vals: number[]) => {
      component.simulationChart = { destroy: jasmine.createSpy('destroy') } as any;
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedId from route', () => {
    expect(component.selectedId).toBe(123);
  });

  it('should call getUserPortfolios on init', () => {
    expect(portfolioSpy.getUserPortfolios).toHaveBeenCalled();
  });

  it('runSimulation should call simulatePortfolio and set simulationChart', fakeAsync(() => {
    component.simulationChart = null as any;
    component.runSimulation();
    tick();
    expect(portfolioSpy.simulatePortfolio)
      .toHaveBeenCalledWith(123, component.startDate, component.endDate);
    expect(component.simulationChart).toBeTruthy();
  }));

  it('should unsubscribe and destroy chart on ngOnDestroy', () => {
    const sub = component.subscription!;
    spyOn(sub, 'unsubscribe');
    const chartStub = component.simulationChart as any;

    component.ngOnDestroy();

    expect(sub.unsubscribe).toHaveBeenCalled();
    expect(chartStub.destroy).toHaveBeenCalled();
    expect(component.simulationChart).toBeNull();
  });
});
