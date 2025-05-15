import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let authSvc: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSvc = jasmine.createSpyObj('AuthService', ['register']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authSvc },
        { provide: Router,      useValue: router  }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /login on successful registration', fakeAsync(() => {
    authSvc.register.and.returnValue(of({} as any));

    component.username = 'notray';
    component.email = 'notray@example.com';
    component.password = 'notray';
    component.onSubmit();
    tick();

    expect(authSvc.register)
      .toHaveBeenCalledWith('notray', 'notray@example.com', 'notray');
    expect(router.navigate)
      .toHaveBeenCalledWith(['/login']);
  }));

  it('should set errorMessage on registration failure', fakeAsync(() => {
    const error = { error: { message: 'Email taken' } };
    authSvc.register.and.returnValue(throwError(() => error));
    component.onSubmit();
    tick();
    expect(component.errorMessage).toBe('Email taken');
    expect(router.navigate).not.toHaveBeenCalled();
  }));
});
