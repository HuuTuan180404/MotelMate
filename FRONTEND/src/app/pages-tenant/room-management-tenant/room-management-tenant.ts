import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomService } from '../../services/roomservice';
import { RoomDetailModel } from '../../models/RoomDetail.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAction, ReusableDialog } from '../../pages/dialog/dialog';
interface Room {
  roomID: number;
  currentOccupants: number;
  maxGuests: number;
  price: number;
  area: number; // m²
  assetData: string[];
  status: boolean;
  description: string;
  images: string[];
  building: Building;
}

interface Building {
  name: string;
  address: string;
  ownerName: string;
  ownerPhone: string;
}

@Component({
  selector: 'app-room-management-tenant',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './room-management-tenant.html',
  styleUrl: './room-management-tenant.css',
})
export class RoomManagementTenant implements OnInit {
  room?: RoomDetailModel;
  _isNeedRoommate: boolean = false;

  selectedImageIndex: number = 0;
  _currentImage: string = '';

  constructor(
    private roomService: RoomService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.roomService.getRoom_Tenant().subscribe({
      next: (room) => {
        this.room = room;
        this._currentImage = this.room.urlRoomImages[0];
        this._isNeedRoommate = this.room.status === 'LookingForRoommate';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Lỗi khi lấy thông tin phòng:', error);
      },
    });
  }

  hasImages(): boolean {
    return !!this.room?.urlRoomImages && this.room.urlRoomImages.length > 0;
  }

  ngOnInit(): void {}

  selectImage(image: string): void {
    this._currentImage = image;
  }

  onRoommateToggle(): void {
    const actions: DialogAction[] = [
      {
        label: 'Ok',
        bgColor: 'primary',
        callback: () => {
          return true;
        },
      },
    ];

    this.roomService.setLookingForRoommate(this.room!.roomID).subscribe({
      next: (message) => {
        const dialogResult = this.dialog.open(ReusableDialog, {
          data: {
            icon: 'check_circle',
            title: 'Successfully',
            message: message.message,
            actions: actions,
          },
        });

        dialogResult.afterClosed().subscribe((result) => {
          this._isNeedRoommate = !this._isNeedRoommate;
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        this.dialog.open(ReusableDialog, {
          data: {
            icon: 'error',
            title: 'Error',
            message: error.message,
            actions: actions,
          },
        });
      },
    });
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) {
      return '';
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }
}
