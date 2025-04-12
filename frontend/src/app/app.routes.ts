import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PortfolioBuilderComponent } from './portfolio-builder/portfolio-builder.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: PortfolioBuilderComponent,
    canActivate: [AuthGuard]
  }
];
