import { Component, signal, computed, effect, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
  ],
  animations: [
    trigger('slideToggle', [
      state('closed', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      state('open', style({ height: '*', opacity: 1 })),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
  ],
})
export class Profile {
  profileImage = 'https://i.imgur.com/8Km9tLL.png';
  editMode = signal(false);
  showPasswordSection = signal(false);
  private fb = inject(FormBuilder);

  form: FormGroup;
  originalValue: any;
  changePasswordForm: FormGroup;

  oldPassword = this.fb.control('', Validators.required);
  newPassword = this.fb.control('', Validators.required);
  confirmPassword = this.fb.control('', Validators.required);

  constructor(public dialogRef: MatDialogRef<Profile>) {
    this.form = this.fb.group({
      fullname: ['Tôn Viết Tri', Validators.required],
      role: ['Owner'],
      email: [
        'tonviettri2004@gmail.com',
        [Validators.required, Validators.email],
      ],
      phoneNumber: [
        '0969696969',
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      bday: ['13/06/2004', Validators.required],
      bankcode: ['123', Validators.required],
      accountno: ['123456789', Validators.required],
      accountname: ['ACCOUNT BANK NAME', Validators.required],
    });
    this.changePasswordForm = this.fb.group({
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    },
    { validators: this.passwordMatchValidator });
    this.originalValue = this.form.getRawValue();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.profileImage = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  enableEdit() {
    this.editMode.set(true);
  }

  cancelEdit() {
    this.editMode.set(false);
    this.form.reset(this.originalValue);
  }

  hasChanges(): boolean {
    return (
      this.editMode() &&
      JSON.stringify(this.form.getRawValue()) !==
        JSON.stringify(this.originalValue)
    );
  }
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('newPassword');
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
  accept() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.hasChanges()) {
      console.log('Accepted form value:', this.form.getRawValue());
      this.originalValue = this.form.getRawValue();
      this.editMode.set(false);
    }
  }

  changePassword() {
    if (this.newPassword.value !== this.confirmPassword.value) {
      alert('New password and confirm password do not match.');
      return;
    }
    console.log(
      'Changing password:',
      this.oldPassword.value,
      this.newPassword.value
    );
    this.oldPassword.reset();
    this.newPassword.reset();
    this.confirmPassword.reset();
    this.showPasswordSection.set(false);
  }
  togglePasswordSection() {
    this.showPasswordSection.update((v) => !v);
  }
}
