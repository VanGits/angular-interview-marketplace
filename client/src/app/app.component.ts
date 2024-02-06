import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavComponent } from './components/general/nav/nav.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/authService';
import { FooterComponent } from './components/general/footer/footer.component';







@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, CommonModule, FooterComponent],
  template: `
  <app-nav *ngIf="showGeneral"></app-nav>
  
  <router-outlet></router-outlet>
  <app-footer *ngIf="showGeneral"></app-footer>
    `,
  styleUrl: './app.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppComponent {
  title = 'Interview Marketplace';
  // Don't show general components on log in and sign up page
  showGeneral = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
          this.showGeneral = isAuthenticated && !['/login', '/signup'].includes(event.urlAfterRedirects);

          if (!isAuthenticated && !['/login', '/signup'].includes(event.urlAfterRedirects)) {
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }
}
