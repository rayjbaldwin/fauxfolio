import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { of } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let authSvc: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authSvc = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: AuthService, useValue: authSvc }
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add an Authorization header when token exists', (done) => {
    authSvc.getToken.and.returnValue('ABC123');

    const req = new HttpRequest('GET', '/test');
    const next: Partial<HttpHandler> = {
      handle: (handledReq: HttpRequest<any>) => {
        expect(handledReq.headers.get('Authorization'))
          .toBe('Bearer ABC123');
        done();
        return of(null as unknown as HttpEvent<any>);
      }
    };

    interceptor.intercept(req, next as HttpHandler).subscribe();
  });

  it('should not add Authorization header when no token', (done) => {
    authSvc.getToken.and.returnValue(null);

    const req = new HttpRequest('GET', '/test');
    const next: Partial<HttpHandler> = {
      handle: (handledReq: HttpRequest<any>) => {
        expect(handledReq.headers.has('Authorization')).toBeFalse();
        done();
        return of(null as unknown as HttpEvent<any>);
      }
    };

    interceptor.intercept(req, next as HttpHandler).subscribe();
  });
});
