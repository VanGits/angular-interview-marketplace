import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [ChartModule, 
    CardModule, 
    ButtonModule, 
    SliderModule, 
    FormsModule, 
    InputTextModule, 
    InputGroupModule, 
    InputGroupAddonModule,
    InputTextareaModule,
    CommonModule
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  value = 3
  data: any;
  options: any

  createRange(value: number): number[] {
    return Array.from({ length: value }, (_, index) => index);
}

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
