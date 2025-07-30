import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl } from "@angular/forms"
import { RouterLink, RouterModule, Router } from "@angular/router"

// Angular Material Imports
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"

@Component({
  selector: "app-tenant-register",
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
  ],
  templateUrl: "./tenant-register.html",
  styleUrls: ["./tenant-register.css"],
})
export class TenantRegister {
  form!: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.form = this.fb.group(
      {
        fullName: ["", [Validators.required]],
        cccd: ["", [Validators.required]],
        phoneNumber: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get("password")
    const confirmPassword = control.get("confirmPassword")

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true }
    }
    return null
  }

  onSubmit() {
    if (this.form.invalid) return

    const formData = this.form.value
    console.log("Tenant registration data:", formData)

    // Handle registration logic here
    // After successful registration, navigate to login or dashboard
    this.router.navigate(["/login"])
  }
}
