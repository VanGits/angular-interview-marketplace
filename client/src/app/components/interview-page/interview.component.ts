import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrl: "./interview.component.css",
  imports: [CommonModule, AccordionModule],
  standalone:true,
})
export class InterviewComponent implements OnInit {
  interviewId: string | null = null;
  interviewData: any; 
  
  

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.interviewId = params.get('interviewId');
      
      
      if (this.interviewId) {
        this.fetchInterviewData(this.interviewId);
      }
    });
  }

  fetchInterviewData(interviewId: string) {
    const apiUrl = `http://localhost:3000/interviews/${interviewId}`;

    this.http.get(apiUrl).subscribe(
      (data) => {
        this.interviewData = data;
        console.log('Interview Data:', data);
      },
      (error) => {
        console.error('Error fetching interview data:', error);
        
      }
    );
  }
}
