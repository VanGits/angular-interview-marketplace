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
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email = ""
  password = ""

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  signup() {
    const body = { email: this.email, password: this.password };
  
  
    this.http.post('http://localhost:3000/register', body).subscribe(
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
