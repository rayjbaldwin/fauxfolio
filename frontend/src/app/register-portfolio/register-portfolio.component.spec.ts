import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPortfolioComponent } from './register-portfolio.component';

describe('RegisterPortfolioComponent', () => {
  let component: RegisterPortfolioComponent;
  let fixture: ComponentFixture<RegisterPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPortfolioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
