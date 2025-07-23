import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
import { Room } from './room/room';
import { AddRoom } from './addroom/addroom';

@Component({
  selector: 'app-roommanagement',
  imports: [
    Room,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatTooltip,
    MatDialogModule,
    MatSliderModule,
  ],
  templateUrl: './roommanagement.html',
  styleUrl: './roommanagement.css',
})
export class RoomManagement {
  isFilterPanelOpen = false;

  constructor(private dialog: MatDialog) {}

  filterRooms: RoomModel[] = [];
  options = [
    { name: 'All', code: -1 },
    { name: 'One', code: 1 },
    { name: 'Two', code: 2 },
    { name: 'Three', code: 3 },
  ];

  // init filter panel
  sliderMin = 0;
  sliderMax = 2000000;
  minPrice = 1000000;
  maxPrice = 2000000;

  buildingCode: any = null;
  searchText: string = '';

  showFilterPanel: boolean = false;
  filteredRooms: any[] = [];

  ngOnInit() {
    this.buildingCode = this.options[0].code;
    this.filteredRooms = [...this.rooms];
  }

  onClick_btnView() {
    this.dialog.open(RoomDetail, {
      disableClose: true,
      minWidth: '90vw',
      maxHeight: '90vh',
      data: { roomId: 123, mode: 'edit' },
    });
  }

  onClick_btnCreate() {
    // this.dialog.open(AddRoom, {
    //   disableClose: true,
    //   minWidth: '90vw',
    //   maxHeight: '90vh',
    // });

    const dialogRef = this.dialog.open(AddRoom, {
      height: 'auto',
      maxHeight: '90vh',
      minWidth: '60vw',
      data: {
        formData: {
          buildingID: 1,
          roomNumber: 1,
          maxGuests: 2,
          area: 2.4,
          price: 1300000,
          images: [],
          description: '',
          assets: [],
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.contracts.push(result);
        // this.applyFilters();
        console.log(result);
      }
    });
  }

  rooms = [
    {
      images: [],
      name: 'R201',
      price: '1.300.000đ',
      priceValue: 1300000,
      maxGuest: 3,
      avatars: [],
      status: 'Available',
    },
    // {
    //   images: [],
    //   name: 'R201',
    //   price: '1.300.000đ',
    //   priceValue: 1300000,
    //   maxGuest: 3,
    //   avatars: [],
    //   status: 'Available',
    // },
    // {
    //   images: [],
    //   name: 'R201',
    //   price: '1.300.000đ',
    //   priceValue: 1300000,
    //   maxGuest: 3,
    //   avatars: [],
    //   status: 'Available',
    // },
    // {
    //   images: [],
    //   name: 'R201',
    //   price: '1.300.000đ',
    //   priceValue: 1300000,
    //   maxGuest: 3,
    //   avatars: [],
    //   status: 'Available',
    // },
    // {
    //   images: [],
    //   name: 'R201',
    //   price: '1.300.000đ',
    //   priceValue: 1300000,
    //   maxGuest: 3,
    //   avatars: [],
    //   status: 'Maintenance',
    // },
    {
      images: [],
      name: 'R201',
      price: '1.300.000đ',
      priceValue: 1300000,
      maxGuest: 3,
      avatars: [],
      status: 'Occupied',
    },
  ];

  onSearchBar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    

    // this.rooms.filter = filterValue.trim().toLowerCase();
  }

  applyFilter() {
    this.filters.minPrice = this.minPrice;
    this.filters.maxPrice = this.maxPrice;
    this.filters.selectedBuildingCode = this.buildingCode;
    console.log('Áp dụng lọc:', this.filters);
  }

  _rooms: RoomModel[] = [
    {
      roomID: 1,
      area: 30,
      price: 5000000,
      status: 'Available',
      description: 'Phòng có ban công, hướng Đông Nam, tầng 3',
      buildingID: 101,
    },
    {
      roomID: 2,
      area: 25,
      price: 4500000,
      status: 'Occupied',
      description: 'Phòng đã được thuê, đầy đủ nội thất',
      buildingID: 101,
    },
    {
      roomID: 3,
      area: 35,
      price: 6000000,
      status: 'Available',
      description: 'Phòng rộng, ánh sáng tốt, gần thang máy',
      buildingID: 102,
    },
    {
      roomID: 4,
      area: 28,
      price: 4700000,
      status: 'Maintenance',
      description: 'Đang sửa chữa hệ thống điện',
      buildingID: 103,
    },
    {
      roomID: 5,
      area: 40,
      price: 7000000,
      status: 'Available',
      description: 'Phòng VIP, có điều hòa, máy giặt riêng',
      buildingID: 101,
    },
    {
      roomID: 6,
      area: 20,
      price: 3900000,
      status: 'Available',
      description: 'Phòng nhỏ phù hợp sinh viên, gần cửa sổ',
      buildingID: 102,
    },
    {
      roomID: 7,
      area: 32,
      price: 5500000,
      status: 'Occupied',
      description: 'Phòng vừa được thuê, nội thất mới',
      buildingID: 103,
    },
    {
      roomID: 8,
      area: 45,
      price: 7500000,
      status: 'Available',
      description: 'Phòng rộng, view thành phố, có ban công lớn',
      buildingID: 101,
    },
    {
      roomID: 9,
      area: 26,
      price: 4300000,
      status: 'Maintenance',
      description: 'Đang nâng cấp trần và hệ thống đèn',
      buildingID: 102,
    },
    {
      roomID: 10,
      area: 38,
      price: 6200000,
      status: 'Available',
      description: 'Phòng yên tĩnh, gần thang bộ, nhiều ánh sáng tự nhiên',
      buildingID: 103,
    },
  ];

  _applyFilters() {
    this.filterRooms = this._rooms.filter((room) => {
      const isPrice =
        room.price >= this.filters.minPrice &&
        room.price <= this.filters.maxPrice;

      const isBuildingCode =
        room.buildingID === this.filters.selectedBuildingCode;
      return isPrice && isBuildingCode;
    });
  }

  filters = {
    minPrice: this.minPrice,
    maxPrice: this.maxPrice,
    selectedBuildingCode: this.buildingCode,
  };

  @ViewChild('filterPanel') filterPanelRef!: ElementRef;

  toggleFilter(event?: MouseEvent) {
    if (event) event.stopPropagation(); // Ngăn click lan ra ngoài
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }

  applyFilters() {
    this.filters.minPrice = this.minPrice;
    this.filters.maxPrice = this.maxPrice;
    this.filters.selectedBuildingCode = this.buildingCode;
    console.log('Áp dụng lọc:', this.filters);
    this.isFilterPanelOpen = false;
  }

  clearFilters() {
    this.filters.minPrice = this.minPrice;
    this.filters.maxPrice = this.maxPrice;
    this.filters.selectedBuildingCode = this.buildingCode;
    console.log('Áp dụng lọc:', this.filters);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      this.isFilterPanelOpen &&
      !this.filterPanelRef?.nativeElement.contains(target)
    ) {
      this.isFilterPanelOpen = false;
    }
  }
}
