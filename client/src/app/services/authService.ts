import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
   public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
   public userInfoSubject = new BehaviorSubject<any>(null);
   public userInfo$ = this.userInfoSubject.asObservable();

   constructor(private http: HttpClient) {
      this.checkAuthenticationStatus();
      this.initializeUserInfoFromSession()
    }

    login(sessionToken: string): void {
      this.isAuthenticatedSubject.next(true);
      this.fetchUserInfo();
  
    }
    
  

   logout(): void {

      sessionStorage.removeItem('sessionToken');
      this.isAuthenticatedSubject.next(false);
   }

   checkAuthenticationStatus(): boolean {
      return !!sessionStorage.getItem('userInfo');
   }

   private fetchUserInfo(): void {
      // Make an HTTP GET request to the backend's /user-info endpoint
      this.http.get<any>('http://localhost:3000/user-info').subscribe(
        (userInfoFromBackend) => {
          // Update the userInfoSubject with the received data
          console.log(userInfoFromBackend)
          sessionStorage.setItem('userInfo', JSON.stringify(userInfoFromBackend))
          this.userInfoSubject.next(userInfoFromBackend);
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
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

      
