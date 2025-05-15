import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService, LoginResponse } from '../services/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authSvc: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSvc = jasmine.createSpyObj('AuthService', ['login']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSvc },
        { provide: Router,      useValue: router  }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate on successful login', fakeAsync(() => {
    const fakeResponse = {} as LoginResponse;
    authSvc.login.and.returnValue(of(fakeResponse));

    component.email = 'ray@example.com';
    component.password = 'ray!';
    component.onSubmit();
    tick();

    expect(authSvc.login)
      .toHaveBeenCalledWith('ray@example.com', 'ray!');
    expect(router.navigate)
      .toHaveBeenCalledWith(['/create-portfolio']);
  }));

  it('should show errorMessage on failure', fakeAsync(() => {
    const failure = { error: { message: 'Bad login' } };
    authSvc.login.and.returnValue(throwError(() => failure));

    component.onSubmit();
    tick();

    expect(component.errorMessage).toBe('Bad login');
    expect(router.navigate).not.toHaveBeenCalled();
  }));
});
