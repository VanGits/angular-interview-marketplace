import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public userInfoSubject = new BehaviorSubject<any>(null);
  public userInfo$ = this.userInfoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthenticationStatus();
    this.initializeUserInfoFromSession();
  }

  login(userInfo: string): void {
    this.fetchUserInfo().subscribe(
      (userInfoFromBackend) => {
        this.newSession(userInfoFromBackend);
        this.isAuthenticatedSubject.next(true);
      },
      (error) => {
        console.error('Error fetching user info:', error);
      }
    );
  }

  newSession(userInfo: any): void {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    this.userInfoSubject.next(userInfo);
  }

  logout(): void {
    sessionStorage.removeItem('userInfo');
    this.isAuthenticatedSubject.next(false);
  }

  checkAuthenticationStatus(): boolean {
    return !!sessionStorage.getItem('userInfo');
  }

  private fetchUserInfo(): Observable<any> {
    
    return this.http.get<any>('http://localhost:3000/user-info');
  }

  private initializeUserInfoFromSession(): void {
    const userInfoStr = sessionStorage.getItem('userInfo');
    if (userInfoStr) {
      this.userInfoSubject.next(JSON.parse(userInfoStr));
    } else {
      this.userInfoSubject.next(null);
    }
  }
}
