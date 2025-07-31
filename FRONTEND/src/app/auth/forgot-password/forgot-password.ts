import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;
  resetForm: FormGroup;
  emailSubmitted = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      otp: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onEmailSubmit() {
    if (this.emailForm.valid) {
      console.log('Email submitted:', this.emailForm.value.email);
      // Simulate sending OTP
      this.emailSubmitted = true;
    }
  }

  onResetSubmit() {
    if (this.resetForm.valid) {
      if (this.resetForm.value.newPassword !== this.resetForm.value.confirmPassword) {
        // Handle password mismatch
        console.error('Passwords do not match');
        this.resetForm.controls['confirmPassword'].setErrors({'passwordMismatch': true});
        return;
      }
      console.log('Password reset submitted');
    }
  }
}
