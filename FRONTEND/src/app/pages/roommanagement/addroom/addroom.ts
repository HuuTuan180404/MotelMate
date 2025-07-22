import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface NewRoom {
  buildingID: number;
  roomNumber: number;
  maxGuests: number;
  area: number;
  price: number;
  images: string[];
  description: string;
  assets: string[];
}

@Component({
  selector: 'app-addroom',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
  ],
  templateUrl: './addroom.html',
  styleUrl: './addroom.css',
})
export class AddRoom {
  selectedImages: File[] = [];

  newRoom = {
    buildingID: 1,
    roomNumber: 1,
    maxGuests: 2,
    area: 2.4,
    price: 1300000,
    images: [],
    description: '',
    assets: [],
  };

  indexCurrentImage = -1;
  formData: NewRoom;
  buildings: string[] = [];
  contracts: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddRoom>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {
    this.formData = this.newRoom;
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.selectedImages = Array.from(event.target.files);
      // this.imagePreviews = [];

      this.selectedImages.forEach((file) => {
        // const reader = new FileReader();
        // reader.onload = (e: any) => {
        //   // this.imagePreviews.push(e.target.result);
        // };
        // reader.readAsDataURL(file);
        console.log(file);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.uploadToCloudinary();
  }

  uploadedImageUrls: string[] = [];

  uploadToCloudinary(): void {
    const cloudName = environment.cloudinary.cloudName;
    const uploadPreset = environment.cloudinary.uploadPreset;

    this.uploadedImageUrls = [];

    this.selectedImages.forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.secure_url) {
            this.uploadedImageUrls.push(data.secure_url);
            // console.log(data.secure_url);
          }
        })
        .catch((err) => console.error('Upload lỗi:', err));
    });

    console.log(this.uploadedImageUrls);
  }

  clearRoomError(): void {
    // this.errorMessage.set('');
  }
}
