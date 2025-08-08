import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export interface RegisterDto {
  userName: string;
  email: string;
  password: string;
  cccd: string;
  fullName: string;
  bdate: string;
  urlAvatar: string;
  accountNo: number;
  accountName: string;
  bankCode: number;
}

export interface ChangePassDTO {
  oldPassword: string;
  newPassword: string;
}
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

  register(registerData: RegisterDto): Observable<any> {
    const headers = { 'Skip-Auth-Interceptor': 'true' };
    return this.http.post(
      `${environment.apiUrl}/api/Account/register`,
      registerData,
      {
        withCredentials: true,
        headers,
      }
    );
  }
  sendOtpEmail(toEmail: string): Observable<any> {
    const headers = { 'Skip-Auth-Interceptor': 'true' };
    return this.http.post(`${environment.apiUrl}/api/Email/send/${toEmail}`, {
      headers,
    });
  }
  resetPassword(resetDto: {
    email: string;
    otp: string;
    newPassword: string;
  }): Observable<any> {
    const headers = { 'Skip-Auth-Interceptor': 'true' };
    return this.http.post(
      `${environment.apiUrl}/api/Account/reset-password`,
      resetDto,
      {
        headers,
        withCredentials: true,
      }
    );
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
    const headers = { 'Skip-Auth-Interceptor': 'true' };
    if (!this.isBrowser) return;
    this.http
      .post(
        `${environment.apiUrl}/api/Account/logout`,
        {},
        { withCredentials: true, headers }
      )
      .subscribe();
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
          headers: headers,
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
  changePassword(dto: ChangePassDTO): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/api/Account/change-password`,
      dto
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
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return (
        decoded[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] || null
      );
    } catch (error) {
      console.error('Invalid token format:', error);
      return null;
    }
  }
}
