import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BuildingWithRoomsModel } from '../../models/Building.model';
import { BuildingService } from '../../services/building-service';
import { NotificationService } from '../../services/notification-service';
import { CreateNotificationDTO } from '../../models/SendNotification.model';
import { DialogAction, ReusableDialog } from '../dialog/dialog';

@Component({
  selector: 'app-sentrequest',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './sendnotification.html',
  styleUrl: './sendnotification.css',
})
export class SendNotification {
  _buildingWithRooms?: BuildingWithRoomsModel[];
  notificationForm: FormGroup;

  isLoading = false;

  // UPDATED: Sử dụng interface room object thay vì string array
  filteredRooms: {
    roomID: number;
    roomNumber: string;
  }[] = [];

  constructor(
    private buildingService: BuildingService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    public matDialog: MatDialog,
    public dialogRef: MatDialogRef<SendNotification>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // UPDATED: Thêm type field vào form
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      targetType: ['building'], // building, room
      selectedBuildings: [[]],
      selectedBuilding: [''], // Cho option room
      selectedRooms: [[]],
    });

    // Load data từ service
    this.buildingService.getBuildingWithRooms().subscribe({
      next: (data: any) => {
        this._buildingWithRooms = data;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
      },
    });
  }

  ngOnInit(): void {
    // Theo dõi thay đổi loại đối tượng
    this.notificationForm.get('targetType')?.valueChanges.subscribe((value) => {
      this.resetSelections();
    });

    // Theo dõi thay đổi tòa nhà được chọn (cho option room)
    this.notificationForm
      .get('selectedBuilding')
      ?.valueChanges.subscribe((buildingId) => {
        this.updateFilteredRooms(buildingId);
      });
  }

  resetSelections(): void {
    this.notificationForm.patchValue({
      selectedBuildings: [],
      selectedBuilding: '',
      selectedRooms: [],
    });
    this.filteredRooms = [];
  }

  // UPDATED: Sử dụng buildingID (number) thay vì string
  updateFilteredRooms(buildingId: number): void {
    if (!buildingId) {
      this.filteredRooms = [];
      return;
    }

    const selectedBuilding = this._buildingWithRooms?.find(
      (b) => b.buildingID === buildingId
    );

    if (selectedBuilding) {
      this.filteredRooms = selectedBuilding.rooms;
    }

    // Reset room selections khi đổi tòa nhà
    this.notificationForm.patchValue({
      selectedRooms: [],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSend(): void {
    if (this.isFormValid()) {
      this.isLoading = true;

      const formValue = this.notificationForm.value;

      const payload: CreateNotificationDTO = {
        title: formValue.title,
        content: formValue.content,
        selectedBuildings:
          formValue.targetType === 'building'
            ? formValue.selectedBuildings
            : [],
        selectedRooms:
          formValue.targetType === 'room' ? formValue.selectedRooms : [],
      };

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
          icon: 'notifications',
          title: 'Notification',
          message: 'Are you sure you want to send this notification?',
          actions: actions,
        },
      });

      dialogResult.afterClosed().subscribe((result) => {
        if (result) {
          this.notificationService.sendNotification(payload).subscribe({
            next: () => {
              this.isLoading = false;
              this.dialogRef.close();
              alert('Gửi thông báo thành công!');
            },
            error: (err) => {
              this.isLoading = false;
              console.log(err);
            },
          });
        }
      });
    } else {
      console.log('Form không hợp lệ');
    }
  }

  getTotalRooms(): number {
    const targetType = this.notificationForm.get('targetType')?.value;

    if (targetType === 'building') {
      const selectedBuildings =
        this.notificationForm.get('selectedBuildings')?.value || [];
      if (selectedBuildings.length === 0) return 0;

      // UPDATED: Tính tổng số phòng thay vì tenantCount
      const totalRooms = this._buildingWithRooms
        ?.filter((b) => selectedBuildings.includes(b.buildingID))
        .reduce((total, building) => total + building.rooms.length, 0);

      return totalRooms ? totalRooms : 0;
    }

    if (targetType === 'room') {
      const selectedRooms =
        this.notificationForm.get('selectedRooms')?.value || [];
      return selectedRooms.length; // Giả sử mỗi phòng có 1 người
    }

    return 0;
  }

  getRoomDetails(): string {
    const targetType = this.notificationForm.get('targetType')?.value;

    if (targetType === 'building') {
      const selectedBuildingIds =
        this.notificationForm.get('selectedBuildings')?.value || [];
      if (selectedBuildingIds.length === 0) return '';

      if (selectedBuildingIds.length === this._buildingWithRooms?.length) {
        return 'Tất cả tòa nhà';
      }

      // UPDATED: Sử dụng buildingName từ model
      const selectedBuildingNames = this._buildingWithRooms
        ?.filter((b) => selectedBuildingIds.includes(b.buildingID))
        .map((b) => b.buildingName);

      const selectedBuilding = selectedBuildingNames
        ? selectedBuildingNames.join(', ')
        : '';
      return selectedBuilding ? selectedBuilding : '';
    }

    if (targetType === 'room') {
      const selectedRooms =
        this.notificationForm.get('selectedRooms')?.value || [];

      // UPDATED: Sử dụng buildingName từ model
      const buildingName = this._buildingWithRooms?.find(
        (b) =>
          b.buildingID === this.notificationForm.get('selectedBuilding')?.value
      )?.buildingName;

      return `${selectedRooms.length} phòng trong ${buildingName}`;
    }

    return '';
  }

  isFormValid(): boolean {
    const targetType = this.notificationForm.get('targetType')?.value;
    const basicValid =
      this.notificationForm.get('title')?.valid &&
      this.notificationForm.get('content')?.valid;

    if (!basicValid) return false;

    if (targetType === 'building') {
      const selectedBuildings =
        this.notificationForm.get('selectedBuildings')?.value || [];
      return selectedBuildings.length > 0;
    }

    if (targetType === 'room') {
      const selectedBuilding =
        this.notificationForm.get('selectedBuilding')?.value;
      const selectedRooms =
        this.notificationForm.get('selectedRooms')?.value || [];
      return selectedBuilding && selectedRooms.length > 0;
    }

    return false;
  }

  selectAllBuildings(): void {
    // UPDATED: Sử dụng buildingID thay vì id
    const allBuildingIds = this._buildingWithRooms?.map((b) => b.buildingID);
    this.notificationForm.patchValue({
      selectedBuildings: allBuildingIds,
    });
  }

  clearAllBuildings(): void {
    this.notificationForm.patchValue({
      selectedBuildings: [],
    });
  }

  selectAllRooms(): void {
    // UPDATED: Lưu toàn bộ room objects thay vì chỉ room numbers
    this.notificationForm.patchValue({
      selectedRooms: [...this.filteredRooms],
    });
  }

  clearAllRooms(): void {
    this.notificationForm.patchValue({
      selectedRooms: [],
    });
  }

  // UPDATED: Sử dụng buildingID (number) thay vì string
  onBuildingChange(buildingId: number, checked: boolean): void {
    const currentBuildings =
      this.notificationForm.get('selectedBuildings')?.value || [];

    if (checked) {
      if (!currentBuildings.includes(buildingId)) {
        this.notificationForm.patchValue({
          selectedBuildings: [...currentBuildings, buildingId],
        });
      }
    } else {
      this.notificationForm.patchValue({
        selectedBuildings: currentBuildings.filter(
          (id: number) => id !== buildingId
        ),
      });
    }
  }

  // UPDATED: Xử lý room object thay vì string
  onRoomChange(
    room: { roomID: number; roomNumber: string },
    checked: boolean
  ): void {
    const currentRooms =
      this.notificationForm.get('selectedRooms')?.value || [];

    if (checked) {
      // UPDATED: Kiểm tra roomID để tránh duplicate
      if (!currentRooms.some((r: any) => r.roomID === room.roomID)) {
        this.notificationForm.patchValue({
          selectedRooms: [...currentRooms, room.roomID],
        });
      }
    } else {
      this.notificationForm.patchValue({
        selectedRooms: currentRooms.filter(
          (r: any) => r.roomID !== room.roomID
        ),
      });
    }
  }

  // ADDED: Method để kiểm tra room đã được chọn chưa (dùng trong template)
  isRoomSelected(room: { roomID: number; roomNumber: string }): boolean {
    const selectedRooms =
      this.notificationForm.get('selectedRooms')?.value || [];
    return selectedRooms.some((r: any) => r.roomID === room.roomID);
  }
}
