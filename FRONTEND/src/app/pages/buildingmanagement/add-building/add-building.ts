import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add-building',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule, 
    MatIconModule,
    MatIcon
  ],
  templateUrl: './add-building.html',
  styleUrl: './add-building.css'
})
export class AddBuilding {
  buildingForm: FormGroup;
  formSubmitted: boolean = false;
  selectedFile: File | null = null;
  previewURL: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddBuilding>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.buildingForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      imageURL: ['']
    });
  }

  
  async onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewURL = reader.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);

      try {
        const imageUrl = await this.uploadImageToCloudinary(this.selectedFile);
        this.buildingForm.get('imageURL')?.setValue(imageUrl);
      } catch (error) {
        console.error('Image upload failed', error);
      }
    }
  }

  
  async uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  }

  save() {
    this.formSubmitted = true;

    if (this.buildingForm.invalid || !this.buildingForm.get('imageURL')?.value) {
      this.buildingForm.markAllAsTouched();
      return;
    }

    const buildingData = this.buildingForm.value;
    this.dialogRef.close(buildingData);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
