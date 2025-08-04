import {
  Component,
  signal,
  computed,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
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
import { AuthService, ChangePassDTO } from '../../auth/auth.service';
import { ProfileDTO, ProfileService } from '../../services/profileservice';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
export function strongPasswordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[\W_]/.test(value); // _ và các ký tự đặc biệt

  const passwordValid =
    hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  return passwordValid ? null : { weakPassword: true };
}
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
    MatIconModule,
  ],
  animations: [
    trigger('slideToggle', [
      state('closed', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      state('open', style({ height: '*', opacity: 1 })),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ]),
  ],
})
export class Profile implements OnInit {
  private profileService = inject(ProfileService);
  private authservice = inject(AuthService);
  private _snackBar = inject(MatSnackBar);

  profileImage = 'https://i.imgur.com/8Km9tLL.png';
  editMode = signal(false);
  showPasswordSection = signal(false);
  private fb = inject(FormBuilder);

  form: FormGroup;
  originalValue: any;
  changePasswordForm: FormGroup;
  hidePassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(public dialogRef: MatDialogRef<Profile>) {
    this.form = this.fb.group({
      fullname: ['', Validators.required],
      role: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      bday: ['', [Validators.required,Validators.pattern(/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/)]],
      bankcode: ['', Validators.required],
      accountno: ['', Validators.required],
      accountname: ['', Validators.required],
    });
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            strongPasswordValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
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
  ngOnInit(): void {
    this.loadProfile();
  }
  loadProfile() {
    this.profileService.getProfile().subscribe((data) => {
      this.form.patchValue({
        fullname: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        bday: this.formatISOToDDMMYYYY(data.bdate),
        role: data.role,
        accountname: data.accountName,
        accountno: data.accountNo,
        bankcode: data.bankCode,
      });
      this.originalValue = this.form.getRawValue();
    });
  }
  accept() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.hasChanges()) {
      var dto: ProfileDTO = {
        ...this.form.getRawValue(),
      };
      dto.bdate = this.parseDDMMYYYYToISO(this.form.value.bday);
      this.profileService.updateProfile(dto).subscribe({
        next: () => {
          this.originalValue = this.form.getRawValue();
          this.editMode.set(false);
          this._snackBar.open('Profile updated successfully!', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-success'],
            verticalPosition: 'top',
          });
        },
        error: (err) => {
          this._snackBar.open(
            'Cannot update profile: ' + (err.error.message || 'Unknown error'),
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

  changePassword() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }
    const dto: ChangePassDTO = {
      oldPassword: this.changePasswordForm.get('oldPassword')!.value || '',
      newPassword: this.changePasswordForm.get('newPassword')!.value || '',
    };

    this.authservice.changePassword(dto).subscribe({
      next: () => {
        this.changePasswordForm.reset();
        this.showPasswordSection.set(false);
        this._snackBar.open(
          'Change password successful please login again!',
          'Close',
          {
            duration: 4000,
            panelClass: ['snackbar-success'],
            verticalPosition: 'top',
          }
        );
        this.authservice.logout();
      },
      error: (err) =>
        this._snackBar.open(
          'Cannot change password: ' + (err.error.message || 'Unknown error'),
          'Close',
          {
            duration: 4000,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top',
          }
        ),
    });
  }
  private parseDDMMYYYYToISO(dateStr: string): string {
    var [day, month, year] = dateStr.split('/');
    while(year.length < 4) year = '0' + year;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  private formatISOToDDMMYYYY(isoDate: string): string {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // JS months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  togglePasswordSection() {
    this.showPasswordSection.update((v) => !v);
  }
}
