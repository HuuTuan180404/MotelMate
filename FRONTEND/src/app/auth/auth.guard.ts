import { jwtDecode } from 'jwt-decode';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, catchError, map, take } from 'rxjs';

interface DecodedToken {
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const token = this.authService.getToken();

    // if token is valid, allow access
    if (token && this.isTokenValid(token)) {
      this.authService.setAuthenticationState(true);
      return of(true);
    }

    // if token is invalid, try to refresh token
    return this.authService.refreshToken().pipe(
      take(1),
      map((response) => {
        if (response?.accessToken && this.isTokenValid(response.accessToken)) {
          this.authService.storeToken(response.accessToken);
          this.authService.setAuthenticationState(true);
          return true;
        }
        throw new Error('Invalid token');
      }),
      catchError(() => {
        this.authService.setAuthenticationState(false);
        this.authService.logout();
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return of(false);
      })
    );
  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp > currentTime) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
