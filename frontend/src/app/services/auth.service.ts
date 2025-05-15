import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'jwt_token';
  private userKey = 'auth_user';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser: LoginResponse['user'] | null = null;

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem(this.userKey);
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch { }
    }
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
          this.currentUser = response.user;
          this.loggedIn.next(true);
        })
      );
  }
  // logout(): void {
  //   localStorage.removeItem(this.tokenKey);
  //   localStorage.removeItem(this.userKey);
  //   this.currentUser = null;
  //   this.loggedIn.next(false);
  // }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // isLoggedIn(): Observable<boolean> {
  //   return this.loggedIn.asObservable();
  // }

  getCurrentUser(): LoginResponse['user'] | null {
    return this.currentUser;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
