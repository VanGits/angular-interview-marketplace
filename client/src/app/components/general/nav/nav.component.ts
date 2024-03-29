import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/authService';
import { CommonModule } from '@angular/common';





@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ButtonModule, RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class NavComponent {
  isAuthenticated: boolean = false;
  userEmail: string | undefined;



  constructor(private authService: AuthService, private router: Router) {}


  logout() {
    this.authService.clearToken(); 
    this.router.navigate(['/login']); 
  }
 }
