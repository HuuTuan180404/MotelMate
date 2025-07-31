import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
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
import { AssetModel } from '../../../models/Asset.model';
import { CreateRoomModel, RoomImageModel } from '../../../models/Room.model';
import { BuildingService } from '../../../services/building-service';
import { BuildingWithRoomsModel } from '../../../models/Building.model';
import { AssetService } from '../../../services/assetservice';
import { ConfirmDialog } from '../../service/confirm-dialog/confirm-dialog';
import { DialogAction, ReusableDialog } from '../../dialog/dialog';
import { RoomService } from '../../../services/roomservice';

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
    MatButtonModule,
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
  @ViewChild('roomNumberInput') roomNumberInput!: ElementRef<HTMLInputElement>;
  roomForm: FormGroup;
  isLoading = false;

  // Mock data - thay thế bằng service thực tế
  _buildings: BuildingWithRoomsModel[] = [];

  _availableAssets: AssetModel[] = [];

  roomImages: RoomImageModel[] = [];
  selectedAssets: number[] = [];
  maxImages = 10;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddRoom>,
    public matDialog: MatDialog,
    private buildingService: BuildingService,
    private assetService: AssetService,
    private roomService: RoomService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roomForm = this.fb.group({
      buildingID: ['', Validators.required], // Changed to array for multiple selection
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

    this.buildingService.getBuildingWithRooms().subscribe({
      next: (data: any) => {
        this._buildings = data;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading rooms:', error);
      },
    });

    this.assetService.getAllAssets().subscribe({
      next: (data: any) => {
        this._availableAssets = data;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error loading rooms:', error);
      },
    });
  }

  // Building selection methods for multiple select
  get selectedBuildingName(): string {
    const selectedId = this.roomForm.get('buildingID')?.value;
    const building = this._buildings.find((b) => b.buildingID === selectedId);
    return building
      ? `${building.buildingName} - ${building.buildingAddress}`
      : '';
  }

  get additionalSelectedCount(): number {
    const selected = this.roomForm.get('buildingID')?.value || [];
    return selected.length > 1 ? selected.length - 1 : 0;
  }

  getSelectedBuildingName(): string {
    const selected = this.roomForm.get('buildingID')?.value || '';
    if (selected === '') return '';

    const building = this._buildings.find((b) => b.buildingID === selected);
    return building ? building.buildingName : '';
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
  }

  isAssetSelected(assetId: number): boolean {
    return this.selectedAssets.includes(assetId);
  }

  getAssetsByType(type: string): AssetModel[] {
    return this._availableAssets.filter((asset) => asset.type === type);
  }

  getAssetTypes(): string[] {
    return [...new Set(this._availableAssets.map((asset) => asset.type))].sort(
      (a, b) => a.localeCompare(b)
    );
  }

  getAssetName(assetId: number): string | undefined {
    return this._availableAssets.find((a) => a.assetID === assetId)?.name;
  }

  // Form methods
  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    if (this.roomForm.valid) {
      const formData = this.roomForm.value;
      const roomsInBuilding = this._buildings.find(
        (building) => building.buildingID === formData.buildingID
      )?.rooms;

      const checkRoomNumberExists = roomsInBuilding?.some(
        (room) => room.roomNumber === formData.roomNumber
      );

      if (checkRoomNumberExists) {
        const actions: DialogAction[] = [
          {
            label: 'Cancel',
            bgColor: 'warn',
            callback: () => {
              return false;
            },
          },
          {
            label: 'Ok',
            bgColor: 'primary',
            callback: () => {
              return true;
            },
          },
        ];

        const dialogResult = this.matDialog.open(ReusableDialog, {
          data: {
            icon: 'error',
            title: 'Error',
            message: 'Number of rooms already exists!',
            actions: actions,
          },
        });

        dialogResult.afterClosed().subscribe((result) => {
          this.roomForm.get('roomNumber')?.setValue('');
        });

        return;
      }
      // this.isLoading = true;

      const formDataToSend = new FormData();
      formDataToSend.append('buildingID', formData.buildingID);
      formDataToSend.append('roomNumber', formData.roomNumber);
      formDataToSend.append('area', formData.area);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);

      this.roomImages.forEach((img, index) => {
        formDataToSend.append('images', img.file);
      });

      this.selectedAssets.forEach((id) => {
        formDataToSend.append('selectedAssetIDs', id.toString());
      });

      this.roomService.postNewRoom(formDataToSend).subscribe({
        next: (res: any) => {
          const actions: DialogAction[] = [
            {
              label: 'Ok',
              bgColor: 'primary',
              callback: () => {
                return true;
              },
            },
          ];

          const dialogResult = this.matDialog.open(ReusableDialog, {
            data: {
              icon: 'done',
              title: 'Info',
              message: 'New room created successfully.',
              actions: actions,
            },
          });

          dialogResult.afterClosed().subscribe((result) => {
            this.dialogRef.close(true);
          });
        },
        error: (err: any) => console.error('Error adding room', err),
      });
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
}
