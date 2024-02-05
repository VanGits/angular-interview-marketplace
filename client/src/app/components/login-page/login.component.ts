import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextModule, PasswordModule, ButtonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  login() {
    const body = { email: this.email, password: this.password };
  
  
    this.http.post('http://localhost:3000/login', body).subscribe(
      (response: any) => {
        this.authService.login(response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
