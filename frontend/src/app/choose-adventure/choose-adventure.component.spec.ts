import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChooseAdventureComponent } from './choose-adventure.component';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PortfolioService } from '../services/portfolio.service';
import { AuthService } from '../services/auth.service';

describe(`ChooseAdventureComponent`, () => {
  let fixture: ComponentFixture<ChooseAdventureComponent>;
  let component: ChooseAdventureComponent;
  let portfolioSvc: jasmine.SpyObj<PortfolioService>;
  let authSvc: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    portfolioSvc = jasmine.createSpyObj('PortfolioService', ['createPortfolio']);
    authSvc = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ /* CommonModule, FormsModule, etc. if needed */ ],
      providers: [
        { provide: PortfolioService, useValue: portfolioSvc },
        { provide: AuthService, useValue: authSvc },
        { provide: Router, useValue: router },
      ]
    });

    fixture  = TestBed.createComponent(ChooseAdventureComponent);
    component = fixture.componentInstance;
  });

  it(`should show an error if no user is logged in`, () => {
    authSvc.getCurrentUser.and.returnValue(null);
    component.createPortfolio();
    expect(component.errorMessage).toBe('User not logged in.');
    expect(portfolioSvc.createPortfolio).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it(`should call the service and navigate on successful creation`, fakeAsync(() => {
    authSvc.getCurrentUser.and.returnValue({email: '', username: '', id: 42 });
    portfolioSvc.createPortfolio.and.returnValue(of({ id: 123 }));

    component.portfolioName = 'My New Port';
    component.createPortfolio();
    tick();
    expect(portfolioSvc.createPortfolio)
      .toHaveBeenCalledWith(42, 'My New Port');
    expect(router.navigate)
      .toHaveBeenCalledWith(['/portfolio', 123]);
    expect(component.errorMessage).toBe('');
  }));
});
