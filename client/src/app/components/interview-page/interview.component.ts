import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { Stripe, loadStripe } from '@stripe/stripe-js';



@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css'],
  imports: [ CommonModule, DividerModule],
  standalone: true,
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
        
      },
      (error) => {
        console.error('Error fetching interview data:', error);
      }
    );
  }

  isLockDisplayed(): boolean {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    return userInfo?.paidInterviews?.includes(this.interviewData.id)
 
    
  }
  async handleUnlockClick() {
    const stripe: Stripe | null = await loadStripe('pk_test_51OgnsVHAvC3FpqaVGOZaKkONZPe1OavWbVCiQuGFYbtTT2pKx3FFNeB8vWjKqAxot24aq1xgqeixKkw2psWgSE5i00yJMcE2Ej');

    if (!stripe) {
      console.error('Stripe has not loaded correctly.');
      return;
    }
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    const uid = userInfo.uid;
    
    const response = await this.http
      .post('http://localhost:3000/create-checkout-session', {
        interviewId: this.interviewId,
        uid: uid, 
      })
      .toPromise();

    const session = response as { sessionId: string };

    const result = await stripe.redirectToCheckout({
      sessionId: session.sessionId,
    });

    if (result.error) {
      console.log(result.error.message);
    }
  }
  
}
