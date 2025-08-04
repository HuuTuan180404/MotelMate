import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatError, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatError,
    MatSuffix,
    MatIcon,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  form!: FormGroup;
  hidePassword = true;
  private _snackBar = inject(MatSnackBar);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    const isAuth = await firstValueFrom(this.authService.isAuthenticated());
    if (isAuth) {
      this.router.navigate(['/dashboard']);
    }
    else{
      this.authService.refreshToken().subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.authService.setAuthenticationState(false);
        },
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;
    this.authService.login({ username, password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this._snackBar.open(
          'Failed to login: Invalid username or password',
          'Close',
          {
            duration: 4000,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top',
          }
        );
      },
    });
  }
}
