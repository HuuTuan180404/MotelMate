import { Component } from '@angular/core';
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

@Component({
  selector: 'app-tenant-register',
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
  templateUrl: './tenant-register.html',
  styleUrls: ['./tenant-register.css'],
})
export class TenantRegister {
  form!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group(
      {
        fullName: ['', Validators.required],
        username: ['', Validators.required],
        cccd: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        birthday: ['', Validators.required], // Date input
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
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
    } = this.form.value;

    const formData = {
      fullName,
      username,
      cccd,
      phoneNumber,
      email,
      birthday, // kiểu Date, có thể format nếu cần
      password,
    };

    console.log('tenant registration data:', formData);
    this.router.navigate(['/login']);
  }
}
