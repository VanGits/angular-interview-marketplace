import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css'],
  imports: [CommonModule, DividerModule],
  standalone: true,
})
export class InterviewComponent implements OnInit {
  interviewId: string | null = null;
  interviewData: any;
  isLocked: boolean = true; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {}

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
        this.checkLockStatus(); 
      },
      (error) => {
        console.error('Error fetching interview data:', error);
      }
    );
  }

  checkLockStatus() {
   
    this.isLocked = !this.authService.isUserPaidForInterview(this.interviewData.id);
  }

  async handleUnlockClick() {
    const stripe: Stripe | null = await loadStripe(
      'pk_test_51OgnsVHAvC3FpqaVGOZaKkONZPe1OavWbVCiQuGFYbtTT2pKx3FFNeB8vWjKqAxot24aq1xgqeixKkw2psWgSE5i00yJMcE2Ej'
    );

    if (!stripe) {
      console.error('Stripe has not loaded correctly.');
      return;
    }

    try {
      const response = await this.http
        .post('http://localhost:3000/create-checkout-session', {
          interviewId: this.interviewId,
          uid: this.authService.getUserInfo()?.uid,
        })
        .toPromise();

      const session = response as { sessionId: string, updatedUserInfo: any };

      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        console.log(result.error.message);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  }

}
