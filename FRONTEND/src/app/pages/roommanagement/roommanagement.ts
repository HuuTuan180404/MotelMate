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
  ],
  templateUrl: './roommanagement.html',
  styleUrl: './roommanagement.css',
})
export class RoomManagement implements OnInit, AfterViewInit {
  isFilterPanelOpen = false;
  _rooms: RoomModel[] = [];
  isLoading = false; // Thêm loading state

  constructor(
    private dialog: MatDialog,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef
  ) {}

  filterRooms: RoomModel[] = [];
  options = [
    { name: 'All', code: -1 },
    { name: 'One', code: 1 },
    { name: 'Two', code: 2 },
    { name: 'Three', code: 3 },
  ];

  ngOnInit(): void {
    this.loadRooms();
  }

  ngAfterViewInit(): void {
    // Trigger change detection sau khi view init
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  private loadRooms(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        this._rooms = data.map(
          (x: any): RoomModel => ({
            roomID: x.roomID,
            roomNumber: x.roomNumber,
            price: x.price,
            status: x.status,
            buildingID: x.buildingID,
            buildingName: x.buildingName,
            urlImage: x.roomImageUrl,
            urlAvatars: x.urlAvatars ?? [],
          })
        );

        this.isLoading = false;

        // Force change detection sau khi load xong data
        this.cdr.detectChanges();

        // Thêm một delay nhỏ để đảm bảo virtual scroll render
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 100);
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  handleImageError(room: RoomModel) {
    // room.urlImage = '../../../assets/images/avatar_error.svg'; // ảnh lỗi trong local
    // this.cdr.detectChanges();
  }

  handleAvatarError(room: RoomModel, index: number) {
    room.urlAvatars[index] = '../../../assets/images/avatar_error.svg'; // ảnh lỗi trong local
    this.cdr.detectChanges();
  }

  showMoreAvatars(room: RoomModel) {
    // Hiển thị dialog hoặc tooltip để xem toàn bộ avatar
    // console.log('More avatars for room:', room.urlAvatars);
    // Ví dụ: Mở dialog với danh sách đầy đủ
    // this.dialog.open(AvatarDialogComponent, { data: room.urlAvatars });
  }

  roomDetail?: RoomDetail;
  viewRoomDetail(id: number) {
    this.roomService.getRoomById(id).subscribe({
      next: (data) => {
        this.dialog.open(RoomDetail, {
          maxWidth: '90vw',
          maxHeight: '90vh',
          data: data,
        });
      },

      error: (error) => {
        console.error('Error loading rooms:', error);
      },
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

  onClick_btnCreate() {
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
        console.log(result);
        // Reload data sau khi thêm mới
        this.loadRooms();
      }
    });
  }

  onSearchBar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // Implement search logic here
    this.cdr.detectChanges(); // Trigger change detection khi search
  }

  applyFilter() {
    // Implement filter logic
    this.cdr.detectChanges();
  }

  _applyFilters() {
    // Implementation for applying filters
  }

  filters = {
    minPrice: this.minPrice,
    maxPrice: this.maxPrice,
    selectedBuildingCode: this.buildingCode,
  };

  @ViewChild('filterPanel') filterPanelRef!: ElementRef;

  toggleFilter(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
    this.cdr.detectChanges(); // Force update UI
  }

  applyFilters() {
    this.filters.minPrice = this.minPrice;
    this.filters.maxPrice = this.maxPrice;
    this.filters.selectedBuildingCode = this.buildingCode;
    console.log('Áp dụng lọc:', this.filters);
    this.isFilterPanelOpen = false;
    this.cdr.detectChanges();
  }

  clearFilters() {
    this.minPrice = this.sliderMin;
    this.maxPrice = this.sliderMax;
    this.buildingCode = null;
    this.filters.minPrice = this.minPrice;
    this.filters.maxPrice = this.maxPrice;
    this.filters.selectedBuildingCode = this.buildingCode;
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      this.isFilterPanelOpen &&
      this.filterPanelRef?.nativeElement &&
      !this.filterPanelRef.nativeElement.contains(target)
    ) {
      this.isFilterPanelOpen = false;
      this.cdr.detectChanges();
    }
  }
}
