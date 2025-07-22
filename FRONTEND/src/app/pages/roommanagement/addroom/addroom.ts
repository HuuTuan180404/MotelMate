import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-addroom',
  imports: [MatFormFieldModule, MatSelectModule, MatDialogModule, FormGroup],
  templateUrl: './addroom.html',
  styleUrl: './addroom.css',
})
export class AddRoom {
  roomForm: FormGroup;
  images: File[] = [];
  imagePreviews: string[] = [];
  buildings = ['Tòa A', 'Tòa B', 'Tòa C'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRoom>
  ) {
    this.roomForm = this.fb.group({
      roomCode: ['', Validators.required],
      building: ['', Validators.required],
      area: ['', [Validators.required, Validators.min(1)]],
      maxPeople: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: [''],
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.images = Array.from(event.target.files);
      this.imagePreviews = [];

      this.images.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onSubmit() {
    if (this.roomForm.valid) {
      const formData = new FormData();

      for (let file of this.images) {
        formData.append('images', file);
      }

      formData.append('roomCode', this.roomForm.value.roomCode);
      formData.append('building', this.roomForm.value.building);
      formData.append('area', this.roomForm.value.area);
      formData.append('maxPeople', this.roomForm.value.maxPeople);
      formData.append('price', this.roomForm.value.price);
      formData.append('description', this.roomForm.value.description);

      console.log('FormData chuẩn bị gửi:', formData);
      // TODO: Gửi formData đến API

      this.dialogRef.close(); // đóng dialog
    }
  }
}
