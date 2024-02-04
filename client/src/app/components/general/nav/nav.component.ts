import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonModule } from 'primeng/button';




@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class NavComponent {

}
