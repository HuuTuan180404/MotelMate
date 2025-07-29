import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isBrowser: boolean;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http
      .post<{ accessToken: string }>(
        `${environment.apiUrl}/api/Account/login`,
        credentials,
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          if (response.accessToken && this.isBrowser) {
            this.storeToken(response.accessToken);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  logout(): void {
    if (!this.isBrowser) return;

    sessionStorage.removeItem('accessToken');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return sessionStorage.getItem('accessToken');
  }

  refreshToken(): Observable<any> {
    // Thêm header để skip interceptor  
    const headers = { 'Skip-Auth-Interceptor': 'true' };

    return this.http
      .post<{ accessToken: string }>(
        `${environment.apiUrl}/api/Account/refresh`,
        {},
        {
          withCredentials: true,
          headers: headers
        }
      )
      .pipe(
        tap((response) => {
          if (response.accessToken && this.isBrowser) {
            this.storeToken(response.accessToken);
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError((error) => {
          this.isAuthenticatedSubject.next(false);
          if (this.isBrowser) {
            sessionStorage.removeItem('accessToken');
          }
          throw error;
        })
      );
  }

  storeToken(accessToken: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem('accessToken', accessToken);
    }
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  setAuthenticationState(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
}
