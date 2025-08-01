import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

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
    MatOptionModule
  ]
})
export class Profile {
  form: FormGroup;
  profileImage = 'https://i.imgur.com/8Km9tLL.png';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<Profile>
  ) {
    this.form = this.fb.group({
      username: ['gene.rodrig'],
      firstName: ['Gene'],
      lastName: ['Rodriguez'],
      nickname: ['Gene.r'],
      role: ['Subscriber'],
      displayName: ['Gene'],
      email: ['gene.rodrig@gmail.com'],
      website: ['gene-roding.webflow.io'],
      whatsapp: ['@gene-rod'],
      telegram: ['@gene-rod'],
      bio: ['Albert Einstein was a German mathematician and physicist...'],
      oldPassword: [''],
      newPassword: ['']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.profileImage = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  changePassword() {
    const { oldPassword, newPassword } = this.form.value;
    console.log('Changing password:', oldPassword, newPassword);
  }
  onClose() {
    this.dialogRef.close();
  }
}
