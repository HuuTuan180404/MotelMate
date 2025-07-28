import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap, mergeMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Bỏ qua interceptor nếu có header Skip-Auth-Interceptor
    if (req.headers.has('Skip-Auth-Interceptor')) {
      const newReq = req.clone({
        headers: req.headers.delete('Skip-Auth-Interceptor')
      });
      return next.handle(newReq);
    }

    // Thêm token vào request nếu có
    const authReq = this.addTokenToRequest(req);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Nếu lỗi 401 và không phải request refresh token
        if (error.status === 401 && !req.url.includes('refresh')) {
          return this.handle401Error(authReq, next);
        }
        return throwError(error);
      })
    );
  }

  private addTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken();
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Nếu đang refresh thì chờ
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return from(this.authService.refreshToken()).pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          // Retry request với token mới
          const newRequest = this.addTokenToRequest(request);
          return next.handle(newRequest);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          // Nếu refresh token thất bại, đăng xuất
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(error);
        })
      );
    }

    // Nếu đang refresh thì tiếp tục request cũ
    return next.handle(request);
  }
}
