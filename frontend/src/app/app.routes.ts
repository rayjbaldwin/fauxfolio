import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PortfolioBuilderComponent } from './portfolio-builder/portfolio-builder.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './register/register.component';
import { PortfolioSimulationComponent } from './portfolio-simulation/portfolio-simulation.component';
import { RegisterPortfolioComponent } from './register-portfolio/register-portfolio.component';
import { SingleAuthComponent } from './single-auth/single-auth.component';

 // { path: 'login', component: LoginComponent },
 // { path: 'register', component: RegisterComponent },

export const routes: Routes = [
  { path: '', component: SingleAuthComponent },
  { path: 'create-portfolio', component: RegisterPortfolioComponent,  canActivate: [AuthGuard] },
  { path: 'portfolio/:id',    component: PortfolioBuilderComponent,   canActivate: [AuthGuard] },
  { path: 'simulate/:id',     component: PortfolioSimulationComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];
