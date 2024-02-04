import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-page/login.component';
import { InterviewsComponent } from './components/interviews-page/interviews.component';

export const routes: Routes = [
    { path: '', component: InterviewsComponent},
    { path: 'login', component: LoginComponent},
   
];
