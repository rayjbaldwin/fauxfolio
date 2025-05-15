// Combined login/register form. Toggles form visibility, handles authentication via AuthService
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './single-auth.component.html',
  styleUrls: ['./single-auth.component.css']
})
export class SingleAuthComponent implements OnInit{
  formVisible = false;
  loginEmail = '';
  loginPassword = '';
  loginError = '';
  regUsername = '';
  regEmail = '';
  regPassword = '';
  regError = '';

  ngOnInit() {
    setTimeout(() => this.formVisible = true, 50);
  }

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.loginError = '';
    this.auth.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => this.router.navigate(['/choose']),
      error: err => this.loginError = err.error?.message || 'Login failed'
    });
  }

  onRegister() {
    this.auth.register(this.regUsername, this.regEmail, this.regPassword)
      .subscribe({
        next: () => {
          this.auth.login(this.regEmail, this.regPassword)
            .subscribe({
              next: () => this.router.navigate(['/choose']),
            });
        },
        error: err => this.regError = err.error?.message || 'Registration failed'
      });
  }

}
