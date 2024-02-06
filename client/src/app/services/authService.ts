import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authTokenKey = 'authToken';

  private authToken: string | null = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private userInfoSubject = new BehaviorSubject<any>(null);
  public userInfo$ = this.userInfoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthenticationStatus();
  }

  setToken(token: string): void {
    this.authToken = token;
    localStorage.setItem(this.authTokenKey, token);
    this.isAuthenticatedSubject.next(true);

    this.fetchUserInfo().subscribe(
      (userInfo) => this.userInfoSubject.next(userInfo),
      (error) => console.error('Error fetching user info:', error)
    );
  }

  getToken(): string | null {
    return this.authToken || localStorage.getItem(this.authTokenKey) || null;
  }

  clearToken(): void {
    this.authToken = null;
    localStorage.removeItem(this.authTokenKey);
    this.isAuthenticatedSubject.next(false);
    this.userInfoSubject.next(null);
  }

  isUserPaidForInterview(interviewId: string): boolean {
    const userInfo = this.userInfoSubject.value;
    return userInfo?.paidInterviews?.includes(interviewId) || false;
  }

  getUserInfo(): any {
    return this.userInfoSubject.value;
  }

  
  async fetchUserInfoSync(): Promise<any> {
    if (!this.userInfoSubject.value) {
      await this.fetchUserInfo().toPromise();
    }
    return this.userInfoSubject.value;
  }

  private checkAuthenticationStatus(): void {
    const token = this.getToken();
    this.isAuthenticatedSubject.next(!!token);

    if (token) {
      this.fetchUserInfo().subscribe(
        (userInfo) => this.userInfoSubject.next(userInfo),
        (error) => console.error('Error fetching user info:', error)
      );
    }
  }

  private fetchUserInfo(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/user-info', {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
}
