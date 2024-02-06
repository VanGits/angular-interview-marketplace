import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/authService';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';





@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    ChartModule,
    CardModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextareaModule,
    CommonModule,
    MessagesModule,


   
  
    
   


  
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardPageComponent implements OnInit {
  value = 5;
  data: any;
  options: any;
  interviewForm!: FormGroup;
  msgs: Message[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    
    this.authService.userInfo$.subscribe(user => {
     
      this.interviewForm = this.fb.group({
        title: new FormControl('', Validators.required),
        price: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
        description: new FormControl('', Validators.required),
        questions: this.fb.array(this.createRange(this.value).map(() => this.fb.control('', Validators.required))),
        author: new FormControl(user ? user.email : '')
      });
    });
   

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Balance',
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    };
  }


  createRange(value: number): number[] {
    return Array.from({ length: value }, (_, index) => index);
  }


  submitInterview() {
    if (this.interviewForm.invalid) {
      return;
    }

    const headers = { 'Content-Type': 'application/json' };
    const url = 'http://localhost:3000/interviews';

    this.http.post(url, this.interviewForm.value, { headers }).subscribe(
      response => {
        console.log('Interview submitted successfully:', response);
        this.msgs = [{ severity: 'success', summary: 'Successful', detail: 'Interview has been created.' }];
        this.interviewForm.reset();
       },
      error => {
        console.error('There was an error submitting the interview:', error);
        this.msgs = [{ severity: 'error', summary: 'Error', detail: 'An error occurred while creating the interview.' }];
      }
    );
  }
}
