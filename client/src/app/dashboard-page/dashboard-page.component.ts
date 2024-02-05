import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import {CardModule} from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [ChartModule, CardModule, ButtonModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  data: any;
  options: any
    
    constructor() {
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Balance',
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
                
            ]
        }
    }
}
