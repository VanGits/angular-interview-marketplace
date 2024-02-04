import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/general/nav/nav.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  template:`
  <app-nav></app-nav>
  <router-outlet></router-outlet>
    `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Interview Marketplace';
}
