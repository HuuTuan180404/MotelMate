import { ChangeDetectorRef, Component, Inject, NgZone } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule, MatSelectTrigger } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Asset } from '../../../models/Asset.model';
import { CreateRoomModel, RoomImageModel } from '../../../models/Room.model';

export interface Building {
  buildingID: number;
  buildingName: string;
  buildingAddress: string;
}

@Component({
  selector: 'app-addroom',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatChipsModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinner,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './addroom.html',
  styleUrl: './addroom.css',
})
export class AddRoom {
  roomForm: FormGroup;
  isLoading = false;

  // Mock data - thay thế bằng service thực tế
  buildings: Building[] = [
    {
      buildingID: 1,
      buildingName: 'Tòa nhà A',
      buildingAddress: '123 Đường ABC',
    },
    {
      buildingID: 2,
      buildingName: 'Tòa nhà B',
      buildingAddress: '456 Đường DEF',
    },
    {
      buildingID: 3,
      buildingName: 'Tòa nhà C',
      buildingAddress: '789 Đường GHI',
    },
    {
      buildingID: 4,
      buildingName: 'Tòa nhà D',
      buildingAddress: '101 Đường JKL',
    },
    {
      buildingID: 5,
      buildingName: 'Tòa nhà E',
      buildingAddress: '202 Đường MNO',
    },
  ];

  availableAssets: Asset[] = [
    {
      assetID: 1,
      assetName: 'Giường đơn',
      assetType: 'Nội thất',
      condition: 'good',
    },
    {
      assetID: 2,
      assetName: 'Tủ quần áo',
      assetType: 'Nội thất',
      condition: 'new',
    },
    {
      assetID: 3,
      assetName: 'Bàn học',
      assetType: 'Nội thất',
      condition: 'good',
    },
    {
      assetID: 4,
      assetName: 'Ghế xoay',
      assetType: 'Nội thất',
      condition: 'fair',
    },
    {
      assetID: 5,
      assetName: 'Điều hòa',
      assetType: 'Điện tử',
      condition: 'new',
    },
    {
      assetID: 6,
      assetName: 'Tủ lạnh mini',
      assetType: 'Điện tử',
      condition: 'good',
    },
    {
      assetID: 7,
      assetName: 'Máy nước nóng',
      assetType: 'Điện tử',
      condition: 'good',
    },
  ];

  roomImages: RoomImageModel[] = [];
  selectedAssets: number[] = [];
  maxImages = 10;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddRoom>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roomForm = this.fb.group({
      buildingID: [[], Validators.required], // Changed to array for multiple selection
      roomNumber: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)],
      ],
      area: [
        '',
        [Validators.required, Validators.min(1), Validators.max(1000)],
      ],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.maxLength(1000)]],
    });
  }

  ngOnInit(): void {
    console.log('Create room dialog initialized');
  }

  // Building selection methods for multiple select
  get selectedBuildingName(): string {
    const selectedId = this.roomForm.get('buildingID')?.value;
    const building = this.buildings.find((b) => b.buildingID === selectedId);
    return building
      ? `${building.buildingName} - ${building.buildingAddress}`
      : '';
  }

  get additionalSelectedCount(): number {
    const selected = this.roomForm.get('buildingID')?.value || [];
    return selected.length > 1 ? selected.length - 1 : 0;
  }

  getSelectedBuildingName(): string {
    const selected = this.roomForm.get('buildingID')?.value || [];
    if (selected.length === 0) return '';

    const selectedNames = selected
      .map((id: number) => {
        const building = this.buildings.find((b) => b.buildingID === id);
        return building ? building.buildingName : '';
      })
      .filter((name: string) => name);

    return selectedNames.join(', ');
  }

  // Image handling methods
  async onFileSelected(event: any): Promise<void> {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;

    const filePromises: Promise<void>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!this.validateFile(file)) continue;
      if (this.roomImages.length >= this.maxImages) {
        console.warn(`Chỉ được tải tối đa ${this.maxImages} ảnh`);
        break;
      }

      const imageId = this.generateId();

      const filePromise = new Promise<void>((resolve) => {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const roomImage: RoomImageModel = {
            id: imageId,
            file: file,
            url: e.target.result,
            isThumb: this.roomImages.length === 0,
            name: file.name,
            size: file.size,
          };

          this.roomImages.push(roomImage);
          console.log('Added image:', roomImage.name);
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

  removeImage(imageId: string): void {
    const index = this.roomImages.findIndex((img) => img.id === imageId);
    if (index > -1) {
      const removedImage = this.roomImages[index];
      this.roomImages.splice(index, 1);

      // Nếu xóa ảnh thumb, chọn ảnh đầu tiên làm thumb mới
      if (removedImage.isThumb && this.roomImages.length > 0) {
        this.roomImages[0].isThumb = true;
      }
      this.cdr.detectChanges();
    }
  }

  setAsThumb(imageId: string): void {
    this.roomImages.forEach((img) => {
      img.isThumb = img.id === imageId;
    });
    this.cdr.detectChanges();
  }

  // Asset handling methods
  onAssetChange(assetId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedAssets.includes(assetId)) {
        this.selectedAssets.push(assetId);
      }
    } else {
      const index = this.selectedAssets.indexOf(assetId);
      if (index > -1) {
        this.selectedAssets.splice(index, 1);
      }
    }
    console.log('Selected assets:', this.selectedAssets);
  }

  isAssetSelected(assetId: number): boolean {
    return this.selectedAssets.includes(assetId);
  }

  getAssetsByType(type: string): Asset[] {
    return this.availableAssets.filter((asset) => asset.assetType === type);
  }

  getAssetTypes(): string[] {
    return [...new Set(this.availableAssets.map((asset) => asset.assetType))];
  }

  getAssetName(assetId: number): string | undefined {
    return this.availableAssets.find((a) => a.assetID === assetId)?.assetName;
  }

  // Form methods
  onCancel(): void {
    // console.log('Cancel create room');
    // this.dialogRef.close();
    console.log(this.roomImages);
  }

  onSave(): void {
    if (this.roomForm.valid) {
      this.isLoading = true;

      const formData = this.roomForm.value;
      const roomData: CreateRoomModel = {
        buildingID: formData.buildingID, // Changed to buildingID
        roomNumber: formData.roomNumber,
        area: formData.area,
        price: formData.price,
        description: formData.description,
        images: this.roomImages,
        selectedAssets: this.selectedAssets,
      };

      console.log('Creating room with data:', roomData);

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        console.log('Room created successfully!');
        this.dialogRef.close(roomData);
      }, 2000);
    } else {
      this.markFormGroupTouched();
      console.log('Form is invalid');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.roomForm.controls).forEach((key) => {
      const control = this.roomForm.get(key);
      control?.markAsTouched();
    });
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  // uploadedImageUrls: string[] = [];

  // uploadToCloudinary(): void {
  //   const cloudName = environment.cloudinary.cloudName;
  //   const uploadPreset = environment.cloudinary.uploadPreset;

  //   this.uploadedImageUrls = [];

  //   this.selectedImages.forEach((file) => {
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     formData.append('upload_preset', uploadPreset);

  //     fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
  //       method: 'POST',
  //       body: formData,
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.secure_url) {
  //           this.uploadedImageUrls.push(data.secure_url);
  //           // console.log(data.secure_url);
  //         }
  //       })
  //       .catch((err) => console.error('Upload lỗi:', err));
  //   });

  //   console.log(this.uploadedImageUrls);
  // }
}
