import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
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
import { Room } from './room/room';
import { AddRoom } from './addroom/addroom';
import { RoomService } from '../../services/roomservice';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
    ScrollingModule,
  ],
  templateUrl: './roommanagement.html',
  styleUrl: './roommanagement.css',
})
export class RoomManagement implements OnInit {
  isFilterPanelOpen = false;
  _rooms: RoomModel[] = [];

  constructor(private dialog: MatDialog, private roomService: RoomService) {}

  filterRooms: RoomModel[] = [];
  options = [
    { name: 'All', code: -1 },
    { name: 'One', code: 1 },
    { name: 'Two', code: 2 },
    { name: 'Three', code: 3 },
  ];

  ngOnInit(): void {
    this.roomService.getAllRooms().subscribe((data) => {
      this._rooms = data.map(
        (x: any): RoomModel => ({
          roomID: x.roomID,
          roomNumber: x.roomNumber,
          price: x.price,
          status: x.status,
          buildingID: x.buildingID,
          buildingName: x.buildingName,
          urlImage: x.roomImageUrl,
          urlAvatars: x.urlAvatars ?? [], // nếu null thì gán mảng rỗng
        })
      );
    });
  }

  // init filter panel
  sliderMin = 0;
  sliderMax = 2000000;
  minPrice = 1000000;
  maxPrice = 2000000;

  buildingCode: any = null;
  searchText: string = '';

  showFilterPanel: boolean = false;
  filteredRooms: any[] = [];

  // ngOnInit() {
  //   this.buildingCode = this.options[0].code;
  //   this.filteredRooms = [...this.rooms];
  // }

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
