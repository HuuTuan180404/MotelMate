import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { RouterLink, RouterModule, Router } from '@angular/router';

// Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-owner-register',
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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './owner-register.html',
  styleUrls: ['./owner-register.css'],
})
export class OwnerRegister {
  form!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group(
      {
        fullName: ['', Validators.required],
        username: ['', Validators.required],
        cccd: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
        phoneNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        birthday: ['', Validators.required], // Date input
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        bankCode: ['', Validators.required],
        accountNum: ['', Validators.required],
        accountName: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    const confirmPasswordErrors = confirmPassword.errors || {};

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({
        ...confirmPasswordErrors,
        passwordMismatch: true,
      });
    } else {
      if (confirmPasswordErrors['passwordMismatch']) {
        delete confirmPasswordErrors['passwordMismatch'];
        if (Object.keys(confirmPasswordErrors).length === 0) {
          confirmPassword.setErrors(null);
        } else {
          confirmPassword.setErrors(confirmPasswordErrors);
        }
      }
    }
    return null;
  }

  onSubmit() {
    if (this.form.invalid) return;

    const {
      fullName,
      username,
      cccd,
      phoneNumber,
      email,
      birthday,
      password,
      bankCode,
      accountNum,
      accountName,
    } = this.form.value;

    const registerDto = {
      fullName,
      userName: username,
      cccd,
      phoneNumber: phoneNumber.toString(),
      email,
      bdate: this.formatDate(birthday),
      password,
      bankCode,
      accountNo: accountNum,
      accountName,
      urlAvatar: '',
    };

    this.authService.register(registerDto).subscribe({
      next: () => {
        this._snackBar.open('Register successful!', 'Close', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top',
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Register failed', err);
        this._snackBar.open(
          'Failed to register: ' + (err.error.message || 'Unknown error'),
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
