import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioSimulationComponent } from './portfolio-simulation.component';

describe('PortfolioSimulationComponent', () => {
  let component: PortfolioSimulationComponent;
  let fixture: ComponentFixture<PortfolioSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioSimulationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
