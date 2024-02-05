import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-page/login.component';
import { InterviewsComponent } from './components/interviews-page/interviews.component';
import { SignupComponent } from './components/signup-page/signup.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';

export const routes: Routes = [
    { path: '', component: InterviewsComponent},
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent},
    { path: 'dashboard', component: DashboardPageComponent},
   
];
