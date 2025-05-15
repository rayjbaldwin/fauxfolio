import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { RegisterPortfolioComponent } from './register-portfolio.component';
import { PortfolioService } from '../services/portfolio.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('RegisterPortfolioComponent', () => {
  let fixture: ComponentFixture<RegisterPortfolioComponent>;
  let component: RegisterPortfolioComponent;
  let portfolioSvc: jasmine.SpyObj<PortfolioService>;
  let authSvc: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    portfolioSvc = jasmine.createSpyObj('PortfolioService', ['createPortfolio']);
    authSvc = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterPortfolioComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioSvc },
        { provide: AuthService, useValue: authSvc },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set errorMessage when user not logged in', () => {
    authSvc.getCurrentUser.and.returnValue(null);

    component.createPortfolio();

    expect(component.errorMessage).toBe('User not logged in.');
    expect(portfolioSvc.createPortfolio).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call service and navigate on successful creation', fakeAsync(() => {
    authSvc.getCurrentUser.and.returnValue({ id: 7 } as any);
    component.portfolioName = 'RayTest';
    portfolioSvc.createPortfolio.and.returnValue(of({ id: 99 }));

    component.createPortfolio();
    tick();

    expect(portfolioSvc.createPortfolio)
      .toHaveBeenCalledWith(7, 'RayTest');
    expect(router.navigate)
      .toHaveBeenCalledWith(['/portfolio', 99]);
    expect(component.errorMessage).toBe('');
  }));

  it('should set errorMessage on service error', fakeAsync(() => {
    authSvc.getCurrentUser.and.returnValue({ id: 5 } as any);
    const err = { error: { message: 'oops' } };
    portfolioSvc.createPortfolio.and.returnValue(throwError(() => err));

    component.createPortfolio();
    tick();

    expect(component.errorMessage).toBe('oops');
    expect(router.navigate).not.toHaveBeenCalled();
  }));
});
