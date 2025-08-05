import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomService } from '../../services/roomservice';
import { RoomDetailModel } from '../../models/RoomDetail.model';
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
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
    private cdr: ChangeDetectorRef
  ) {
    this.roomService.getRoom_Tenant().subscribe({
      next: (room) => {
        // console.log(room);
        this.room = room;
        this._currentImage = this.room.urlRoomImages[0];
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
    if (this.room?.status === 'LookingForRoommate') {
      this._isNeedRoommate = true;
    }
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
