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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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

  // ADDED: Thêm notification types để sử dụng trong template
  notificationTypes = [
    { value: 'info', label: 'Thông tin', icon: 'info' },
    { value: 'warning', label: 'Cảnh báo', icon: 'warning' },
    { value: 'urgent', label: 'Khẩn cấp', icon: 'priority_high' },
  ];

  isLoading = false;

  // UPDATED: Sử dụng interface room object thay vì string array
  filteredRooms: {
    roomID: number;
    roomNumber: string;
  }[] = [];

  constructor(
    private buildingService: BuildingService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SendNotification>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // UPDATED: Thêm type field vào form
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      type: ['info'], // ADDED: Thêm field type
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
      console.log('Target type changed to:', value);
    });

    // Theo dõi thay đổi tòa nhà được chọn (cho option room)
    this.notificationForm
      .get('selectedBuilding')
      ?.valueChanges.subscribe((buildingId) => {
        this.updateFilteredRooms(buildingId);
        console.log('Selected building changed to:', buildingId);
      });
  }

  resetSelections(): void {
    this.notificationForm.patchValue({
      selectedBuildings: [],
      selectedBuilding: '',
      selectedRooms: [],
    });
    this.filteredRooms = [];
    console.log('Selections reset');
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
      console.log(
        'Filtered rooms for building:',
        selectedBuilding.buildingName,
        this.filteredRooms
      );
    }

    // Reset room selections khi đổi tòa nhà
    this.notificationForm.patchValue({
      selectedRooms: [],
    });
  }

  onCancel(): void {
    console.log('Hủy gửi thông báo');
    this.dialogRef.close();
  }

  onSend(): void {
    if (this.isFormValid()) {
      this.isLoading = true;
      const formData = this.notificationForm.value;

      console.log('Đang gửi thông báo...', {
        ...formData,
        recipients: this.getTotalRooms(),
        recipientDetails: this.getRoomDetails(),
      });

      // Giả lập gửi thông báo
      setTimeout(() => {
        this.isLoading = false;
        console.log('Gửi thông báo thành công!');
        this.dialogRef.close(formData);
      }, 2000);
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
    console.log('Đã chọn tất cả tòa nhà:', allBuildingIds);
  }

  clearAllBuildings(): void {
    this.notificationForm.patchValue({
      selectedBuildings: [],
    });
    console.log('Đã bỏ chọn tất cả tòa nhà');
  }

  selectAllRooms(): void {
    // UPDATED: Lưu toàn bộ room objects thay vì chỉ room numbers
    this.notificationForm.patchValue({
      selectedRooms: [...this.filteredRooms],
    });
    console.log('Đã chọn tất cả phòng:', this.filteredRooms);
  }

  clearAllRooms(): void {
    this.notificationForm.patchValue({
      selectedRooms: [],
    });
    console.log('Đã bỏ chọn tất cả phòng');
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

    console.log(
      'Tòa nhà được chọn:',
      this.notificationForm.get('selectedBuildings')?.value
    );
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
          selectedRooms: [...currentRooms, room],
        });
      }
    } else {
      this.notificationForm.patchValue({
        selectedRooms: currentRooms.filter(
          (r: any) => r.roomID !== room.roomID
        ),
      });
    }

    console.log(
      'Phòng được chọn:',
      this.notificationForm.get('selectedRooms')?.value
    );
  }

  // ADDED: Method để kiểm tra room đã được chọn chưa (dùng trong template)
  isRoomSelected(room: { roomID: number; roomNumber: string }): boolean {
    const selectedRooms =
      this.notificationForm.get('selectedRooms')?.value || [];
    return selectedRooms.some((r: any) => r.roomID === room.roomID);
  }
}
