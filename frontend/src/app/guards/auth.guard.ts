import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    // Check if a token exists. You could also subscribe to an observable.
    if (this.authService.getToken()) {
      return true;
    }
    // If not authenticated, redirect to the login page.
    return this.router.parseUrl('/login');
  }
}
