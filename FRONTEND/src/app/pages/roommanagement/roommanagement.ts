import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RoomDetail } from '../roomdetail/roomdetail';
import { MatSliderModule } from '@angular/material/slider';
import { RoomModel } from '../../models/Room.model';
import { AddRoom } from './addroom/addroom';
import { RoomService } from '../../services/roomservice';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTAIN = 'maintain',
}

@Component({
  selector: 'app-roommanagement',
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatTooltip,
    MatDialogModule,
    MatSliderModule,
    ScrollingModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatChipsModule,
    MatButtonModule,
  ],
  templateUrl: './roommanagement.html',
  styleUrl: './roommanagement.css',
})
export class RoomManagement implements OnInit {
  // rooms: RoomModel[] = [];
  filteredRooms: RoomModel[] = [];
  selectedStatus = 'all';
  selectedBuilding = 'all';
  searchTerm = '';
  isLoading = true;

  statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái', icon: 'list' },
    { value: RoomStatus.AVAILABLE, label: 'Có sẵn', icon: 'check_circle' },
    { value: RoomStatus.OCCUPIED, label: 'Đã thuê', icon: 'person' },
    { value: RoomStatus.MAINTAIN, label: 'Bảo trì', icon: 'build' },
  ];

  rooms: RoomModel[] = [
    {
      roomID: 1,
      roomNumber: '101',
      price: 5000000,
      status: RoomStatus.AVAILABLE,
      buildingID: 1,
      buildingName: 'Tòa A',
      urlImage:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      urlAvatars: [],
    },
    {
      roomID: 2,
      roomNumber: '102',
      price: 6000000,
      status: RoomStatus.OCCUPIED,
      buildingID: 1,
      buildingName: 'Tòa A',
      urlImage:
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      urlAvatars: [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      ],
    },
    {
      roomID: 3,
      roomNumber: '201',
      price: 5500000,
      status: RoomStatus.MAINTAIN,
      buildingID: 2,
      buildingName: 'Tòa B',
      urlImage:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      urlAvatars: [],
    },
    {
      roomID: 4,
      roomNumber: '202',
      price: 7000000,
      status: RoomStatus.OCCUPIED,
      buildingID: 2,
      buildingName: 'Tòa B',
      urlImage:
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      urlAvatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      ],
    },
    {
      roomID: 5,
      roomNumber: '301',
      price: 6500000,
      status: RoomStatus.AVAILABLE,
      buildingID: 3,
      buildingName: 'Tòa C',
      urlImage:
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
      urlAvatars: [],
    },
    {
      roomID: 6,
      roomNumber: '302',
      price: 8000000,
      status: RoomStatus.OCCUPIED,
      buildingID: 3,
      buildingName: 'Tòa C',
      urlImage:
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
      urlAvatars: [
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      ],
    },
  ];

  buildings: { value: string; label: string }[] = [];

  constructor(
    private roomService: RoomService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.roomService.getRooms().subscribe((rooms) => {
        this.rooms = rooms;
        this.filteredRooms = rooms;
        this.extractBuildings();
        this.isLoading = false;
      });
    }, 1000); // Simulate loading
  }

  extractBuildings(): void {
    const uniqueBuildings = [
      ...new Set(this.rooms.map((room) => room.buildingName)),
    ];
    this.buildings = [
      { value: 'all', label: 'Tất cả tòa nhà' },
      ...uniqueBuildings.map((building) => ({
        value: building,
        label: building,
      })),
    ];
  }

  filterRooms(): void {
    this.filteredRooms = this.rooms.filter((room) => {
      const matchesStatus =
        this.selectedStatus === 'all' || room.status === this.selectedStatus;
      const matchesBuilding =
        this.selectedBuilding === 'all' ||
        room.buildingName === this.selectedBuilding;
      const matchesSearch =
        room.roomNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        room.buildingName.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesStatus && matchesBuilding && matchesSearch;
    });
  }

  onStatusChange(): void {
    this.filterRooms();
  }

  onBuildingChange(): void {
    this.filterRooms();
  }

  onSearchChange(): void {
    this.filterRooms();
  }

  updateRoomStatus(room: RoomModel, newStatus: string): void {
    // const oldStatus = room.status;
    // this.roomService
    //   .updateRoomStatus(room.roomID, newStatus)
    //   .subscribe((success) => {
    //     if (success) {
    //       room.status = newStatus;
    //       this.filterRooms();
    //       this.snackBar.open(
    //         `Đã cập nhật trạng thái phòng ${
    //           room.roomNumber
    //         } thành ${this.roomService.getStatusText(newStatus)}`,
    //         'Đóng',
    //         {
    //           duration: 3000,
    //           horizontalPosition: 'right',
    //           verticalPosition: 'top',
    //         }
    //       );
    //     } else {
    //       this.snackBar.open('Có lỗi xảy ra khi cập nhật trạng thái', 'Đóng', {
    //         duration: 3000,
    //         panelClass: ['error-snackbar'],
    //       });
    //     }
    //   });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'primary';
      case RoomStatus.OCCUPIED:
        return 'warn';
      case RoomStatus.MAINTAIN:
        return 'accent';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'Có sẵn';
      case RoomStatus.OCCUPIED:
        return 'Đã thuê';
      case RoomStatus.MAINTAIN:
        return 'Bảo trì';
      default:
        return 'Không xác định';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'check_circle';
      case RoomStatus.OCCUPIED:
        return 'person';
      case RoomStatus.MAINTAIN:
        return 'build';
      default:
        return 'help';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  getRoomStats() {
    const total = this.rooms.length;
    const available = this.rooms.filter(
      (r) => r.status === RoomStatus.AVAILABLE
    ).length;
    const occupied = this.rooms.filter(
      (r) => r.status === RoomStatus.OCCUPIED
    ).length;
    const maintain = this.rooms.filter(
      (r) => r.status === RoomStatus.MAINTAIN
    ).length;

    return { total, available, occupied, maintain };
  }

  clearFilters(): void {
    this.selectedStatus = 'all';
    this.selectedBuilding = 'all';
    this.searchTerm = '';
    this.filterRooms();
  }
}
