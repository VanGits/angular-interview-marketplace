import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { PanelModule } from 'primeng/panel';



@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, PanelModule],
  templateUrl: './interviews.component.html',
  styleUrl: './interviews.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class InterviewsComponent {
  constructor(private http: HttpClient, private router: Router) {

  }
  fetchData(): Observable<any> {
    return this.http.get('http://localhost:3000/interviews');
  }
  data: any;

  ngOnInit() {
    this.fetchData().subscribe(response => {
      this.data = response;
      
    });
  }
  unlockInterview(interviewId: string) {
   
    this.router.navigate(['/interview', interviewId]);
   
  }
}
