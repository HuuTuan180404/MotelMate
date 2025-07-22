import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  form: any;
  isSubmitted: boolean = false;
  isShowPassword: boolean = false;
  isShowConfirmPassword: boolean = false;
  constructor(
    public formBuilder: FormBuilder // private service: Auth, // private toastr: ToastrService
  ) {}

  togglePasswordVisibility(isPassword: boolean = true): void {
    if (isPassword) {
      this.isShowPassword = !this.isShowPassword;
    } else {
      this.isShowConfirmPassword = !this.isShowConfirmPassword;
    }
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors({ passwordMismatch: true });
    else confirmPassword?.setErrors(null);

    return null;
  };

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        fullName: ['', Validators.required],
        CCCD: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.pattern(/^\d+$/),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/(?=.*[^a-zA-Z0-9])/),
          ],
        ],
        confirmPassword: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  onSubmit() {
    this.isSubmitted = true;
    // this.service.createUser(this.form.value.fullName).subscribe({
    //   next: (res: any) => {
    //     if (res.succeeded){
    //       this.form.reset();
    //       this.isSubmitted=false;
    //       this.toastr.success('Created','Rigister');
    //     }
    //     console.log(res);
    //   },
    //   error:(err:any)=>console.log('error',err);

    // });
    console.log(this.form.value);
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    let result: boolean =
      Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched));
    return result;
  }
}
