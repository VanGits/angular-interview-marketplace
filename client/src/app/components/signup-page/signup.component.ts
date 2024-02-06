import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, InputTextModule, PasswordModule, ButtonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  signup() {
    this.loading = true;

    const body = { email: this.email, password: this.password };

    this.http.post('http://localhost:3000/register', body).subscribe(
      (response: any) => {
        const token = response.token;
        console.log(token);
        if (token) {
          this.authService.setToken(response);
          this.router.navigate(['/']);
        }
      },
      (error) => {
        console.error(error);
      }
    ).add(() => {
      this.loading = false;
    });
  }
}
