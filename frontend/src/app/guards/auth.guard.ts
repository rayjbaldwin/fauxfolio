
// Route guard that allows access only if a valid auth token exists, otherwise redirects to the login page.

import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.getToken()) {
      return true;
    }
    return this.router.parseUrl('/login');
  }
}
