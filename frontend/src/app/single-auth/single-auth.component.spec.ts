import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { SingleAuthComponent } from './single-auth.component';
import { AuthService } from '../services/auth.service';

describe('SingleAuthComponent', () => {
  let component: SingleAuthComponent;
  let fixture: ComponentFixture<SingleAuthComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SingleAuthComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router,      useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleAuthComponent);
    component = fixture.componentInstance;
  });

  it('should create and initially hide form', () => {
    expect(component).toBeTruthy();
    expect(component.formVisible).toBeFalse();
  });

  it('should show form after ngOnInit delay', fakeAsync(() => {
    component.ngOnInit();
    tick(50);
    expect(component.formVisible).toBeTrue();
  }));

  describe('onLogin', () => {
    it('should navigate on successful login', fakeAsync(() => {
      authSpy.login.and.returnValue(of({} as any));
      component.loginEmail = 'a@example.com';
      component.loginPassword = 'pass';
      component.onLogin();
      tick();
      expect(authSpy.login).toHaveBeenCalledWith('a@example.com', 'pass');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/choose']);
      expect(component.loginError).toBe('');
    }));

    it('should set loginError on failure', fakeAsync(() => {
      const err = { error: { message: 'Bad login' } };
      authSpy.login.and.returnValue(throwError(() => err));
      component.onLogin();
      tick();
      expect(component.loginError).toBe('Bad login');
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('onRegister', () => {
    it('should register then login and navigate', fakeAsync(() => {
      authSpy.register.and.returnValue(of({} as any));
      authSpy.login.and.returnValue(of({} as any));
      component.regUsername = 'ray';
      component.regEmail = 'ray@example.com';
      component.regPassword = 'ray';
      component.onRegister();
      tick();
      expect(authSpy.register).toHaveBeenCalledWith('ray', 'ray@example.com', 'ray');
      expect(authSpy.login).toHaveBeenCalledWith('ray@example.com', 'ray');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/choose']);
    }));

    it('should set regError on registration failure', fakeAsync(() => {
      const err = { error: { message: 'Reg fail' } };
      authSpy.register.and.returnValue(throwError(() => err));
      component.onRegister();
      tick();
      expect(component.regError).toBe('Reg fail');
      expect(authSpy.login).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    }));
  });
});
