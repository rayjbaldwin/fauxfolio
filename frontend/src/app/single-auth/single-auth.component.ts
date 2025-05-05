import { Component }    from '@angular/core';
import { Router }       from '@angular/router';
import { AuthService }  from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './single-auth.component.html',
  styleUrls: ['./single-auth.component.css']
})
export class SingleAuthComponent {
  loginEmail    = '';
  loginPassword = '';
  loginError    = '';
  regUsername = '';
  regEmail    = '';
  regPassword = '';
  regError    = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.loginError = '';
    this.auth.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => this.router.navigate(['/create-portfolio']),
      error: err => this.loginError = err.error?.message || 'Login failed'
    });
  }

  onRegister() {
    this.regError = '';
    this.auth.register(this.regUsername, this.regEmail, this.regPassword).subscribe({
      next: () => {
        this.loginEmail = this.regEmail;
        this.loginPassword = '';
      },
      error: err => this.regError = err.error?.message || 'Registration failed'
    });
  }
}
