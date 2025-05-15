import { TestBed } from '@angular/core/testing';
import { Router, RouterModule, UrlTree } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authSvc: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(() => {
    authSvc = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([], { initialNavigation: 'disabled' })
      ],
      providers: [
        provideLocationMocks(),
        AuthGuard,
        { provide: AuthService, useValue: authSvc }
      ]
    });

    guard  = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should redirect to /login when no token', () => {
    authSvc.getToken.and.returnValue(null);

    const result = guard.canActivate();
    expect(result).toEqual(router.parseUrl('/login') as UrlTree);
  });

  it('should allow when token exists', () => {
    authSvc.getToken.and.returnValue('VALID_TOKEN');

    const result = guard.canActivate();
    expect(result).toBeTrue();
  });
});
