import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  emailForm: FormGroup;
  resetForm: FormGroup;
  emailSubmitted = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private fb: FormBuilder, private router: Router) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetForm = this.fb.group(
      {
        otp: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm
      ? null
      : group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
  }

  onEmailSubmit() {
    if (this.emailForm.invalid) return;

    const email = this.emailForm.value.email;

    this.authService.sendOtpEmail(email).subscribe({
      next: () => {
        this._snackBar.open('OTP sent to your email.', 'Close', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top',
        });
        this.emailSubmitted = true;
      },
      error: (err) => {
        console.error('Failed to send OTP', err);
        this._snackBar.open(
          'Failed to send OTP: ' + (err.error?.message || 'Unknown error'),
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

  onResetSubmit() {
    if (this.resetForm.invalid) return;

    const resetDto = {
      email: this.emailForm.value.email,
      otp: this.resetForm.value.otp,
      newPassword: this.resetForm.value.newPassword,
    };

    this.authService.resetPassword(resetDto).subscribe({
      next: () => {
        this._snackBar.open('Password reset successful!', 'Close', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top',
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Reset password failed', err);
        this._snackBar.open(
          'Failed to reset password: ' +
            (err.error?.message || 'Unknown error'),
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
