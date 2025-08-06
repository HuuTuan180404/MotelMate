import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RoomImageModel } from '../../models/Room.model';
import { RequestService } from '../../services/request-service';
import { EnumModel } from '../../models/Enum.model';

@Component({
  selector: 'app-send-request',
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
  ],
  templateUrl: './send-request.html',
  styleUrl: './send-request.css',
})
export class SendRequest {
  requestForm: FormGroup;
  // selectedImages: File[] = [];
  maxImages = 1;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  images: RoomImageModel[] = [];

  requestTypes: EnumModel[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private requestService: RequestService,
    public dialogRef: MatDialogRef<SendRequest>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.requestForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.maxLength(1000)]],
      requestType: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.requestService.getRequestType().subscribe((data) => {
      this.requestTypes = data;
      this.cdr.detectChanges();
    });
  }

  validateFile(file: File): boolean {
    if (!this.allowedTypes.includes(file.type)) {
      console.error('File type not allowed:', file.type);
      return false;
    }

    if (file.size > this.maxFileSize) {
      console.error('File too large:', file.size);
      return false;
    }

    return true;
  }

  async onFileSelected(event: any): Promise<void> {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;

    const filePromises: Promise<void>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!this.validateFile(file)) continue;
      if (this.images.length >= this.maxImages) {
        console.warn(`Chỉ được tải tối đa ${this.maxImages} ảnh`);
        break;
      }

      const filePromise = new Promise<void>((resolve) => {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const roomImage: RoomImageModel = {
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            url: e.target.result,
            isThumb: this.images.length === 0,
            name: file.name,
            size: file.size,
          };

          this.images.push(roomImage);
          resolve();
        };

        reader.readAsDataURL(file);
      });

      filePromises.push(filePromise);
    }

    // Wait for all files to be processed
    await Promise.all(filePromises);

    // Force UI update
    this.cdr.detectChanges();

    // Reset input
    event.target.value = '';
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      const formValue = this.requestForm.value;

      const formDataToSend = new FormData();

      // Thêm dữ liệu form cơ bản
      formDataToSend.append('title', formValue.title);
      formDataToSend.append('content', formValue.content);
      formDataToSend.append('type', formValue.requestType); // hoặc .type nếu bạn sửa tên form control
      if (this.data?.buildingID) {
        formDataToSend.append('buildingID', this.data.buildingID.toString());
      }

      // Thêm ảnh (1 ảnh duy nhất vì bạn giới hạn = 1)
      if (this.images.length > 0) {
        formDataToSend.append('images', this.images[0].file);
      }

      // Gửi API
      this.requestService.createRequest(formDataToSend).subscribe({
        next: (res) => {
          alert('Gửi yêu cầu thành công!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          alert('Gửi yêu cầu thất bại!');
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.requestForm.controls).forEach((key) => {
      const control = this.requestForm.get(key);
      control?.markAsTouched();
    });
  }

  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }
}
