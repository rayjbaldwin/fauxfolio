import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioBuilderComponent } from './portfolio-builder.component';

describe('PortfolioBuilderComponent', () => {
  let component: PortfolioBuilderComponent;
  let fixture: ComponentFixture<PortfolioBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
