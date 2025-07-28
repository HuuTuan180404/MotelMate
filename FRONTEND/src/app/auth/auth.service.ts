import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isBrowser: boolean;
  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    if (this.isBrowser) {
      this.tryRefreshToken();
    }
    
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  isAuthenticated$: Observable<boolean>;

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
    return this.http
      .post<{ accessToken: string }>(
        `${environment.apiUrl}/api/Account/refresh`,
        {},
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

  storeToken(accessToken: string): void {
    sessionStorage.setItem('accessToken', accessToken);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }
  private tryRefreshToken(): void {
    this.refreshToken().subscribe({
      next: (res) => {},
      error: (err) => {
        console.warn('Refresh token failed:', err);
        this.isAuthenticatedSubject.next(false);
      },
    });
  }
}
