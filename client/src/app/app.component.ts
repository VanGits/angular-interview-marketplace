import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavComponent } from './components/general/nav/nav.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/authService';






@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, CommonModule],
  template: `
  <app-nav *ngIf="showNav"></app-nav>
  
  <router-outlet></router-outlet>
    `,
  styleUrl: './app.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppComponent {
  title = 'Interview Marketplace';
  // Don't show nav bar on log in and sign up page
  showNav = true;
  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNav = !['/login', '/signup'].includes(event.urlAfterRedirects);
      }
    });
    // Disable access to listings if there isn't a user
    if (!this.authService.checkAuthenticationStatus()) {
      this.router.navigate(['/login']);
    }

  }
}
