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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoomDetail } from '../roomdetail/roomdetail';
import { MatSliderModule } from '@angular/material/slider';
import { RoomModel } from '../../models/Room.model';
import { AddRoom } from './addroom/addroom';
import { RoomService } from '../../services/roomservice';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-roommanagement',
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTooltip,
    MatDialogModule,
    MatSliderModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './roommanagement.html',
  styleUrl: './roommanagement.css',
})
export class RoomManagement implements OnInit, AfterViewInit {
  isFilterPanelOpen = false;

  // Dữ liệu gốc và dữ liệu đã filter
  allRooms: RoomModel[] = []; // Tất cả dữ liệu từ API
  filteredRooms: RoomModel[] = []; // Dữ liệu sau khi filter/search
  displayedRooms: RoomModel[] = []; // Dữ liệu hiển thị trên trang hiện tại

  isLoading = false;

  // Pagination properties
  currentPage = 0;
  pageSize = 10;
  totalFilteredRooms = 0;
  pageSizeOptions = [5, 10, 15];

  // Filter properties
  sliderMin = 0;
  sliderMax = 2000000;
  minPrice = 0;
  maxPrice = 2000000;
  buildingCode: any = null;
  searchText: string = '';

  constructor(
    private dialog: MatDialog,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef
  ) {}

  options = [
    { name: 'All', code: -1 },
    { name: 'One', code: 1 },
    { name: 'Two', code: 2 },
    { name: 'Three', code: 3 },
  ];

  ngOnInit(): void {
    this.loadAllRooms();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  // Load tất cả dữ liệu một lần
  private loadAllRooms(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        this.allRooms = data.map(
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

        // Tính toán min/max price từ dữ liệu thực tế
        this.calculatePriceRange();

        // Áp dụng filter và phân trang
        this.applyFiltersAndPagination();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Tính toán khoảng giá từ dữ liệu thực tế
  private calculatePriceRange(): void {
    if (this.allRooms.length > 0) {
      const prices = this.allRooms.map((room) => room.price);
      this.sliderMin = Math.min(...prices);
      this.sliderMax = Math.max(...prices);

      // Set giá trị mặc định
      if (this.minPrice === 0) this.minPrice = this.sliderMin;
      if (this.maxPrice === 2000000) this.maxPrice = this.sliderMax;
    }
  }

  // Áp dụng filter và phân trang
  private applyFiltersAndPagination(): void {
    // Bước 1: Filter dữ liệu
    this.filteredRooms = this.allRooms.filter((room) => {
      // Filter theo search text
      const matchesSearch =
        !this.searchText ||
        room.roomNumber
          .toString()
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        room.buildingName
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        room.status.toLowerCase().includes(this.searchText.toLowerCase());

      // Filter theo building
      const matchesBuilding =
        !this.buildingCode ||
        this.buildingCode === -1 ||
        room.buildingID === this.buildingCode;

      // Filter theo price range
      const matchesPrice =
        room.price >= this.minPrice && room.price <= this.maxPrice;

      return matchesSearch && matchesBuilding && matchesPrice;
    });

    // Bước 2: Cập nhật tổng số sau filter
    this.totalFilteredRooms = this.filteredRooms.length;

    // Bước 3: Phân trang
    this.updateDisplayedRooms();
  }

  // Cập nhật dữ liệu hiển thị theo trang hiện tại
  private updateDisplayedRooms(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedRooms = this.filteredRooms.slice(startIndex, endIndex);
  }

  // Xử lý thay đổi trang
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedRooms();
    this.cdr.detectChanges();
  }

  resetSearch(searchtext: string, ev: any) {
    this.searchText = searchtext;
    this.onSearchBar(ev);
  }

  // Xử lý search
  onSearchBar(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchText = filterValue;
    this.currentPage = 0; // Reset về trang đầu
    this.applyFiltersAndPagination();
    this.cdr.detectChanges();
  }

  // Áp dụng filters
  applyFilters(): void {
    this.currentPage = 0; // Reset về trang đầu
    this.applyFiltersAndPagination();
    this.isFilterPanelOpen = false;
    this.cdr.detectChanges();
  }

  // Xóa filters
  clearFilters(): void {
    this.minPrice = this.sliderMin;
    this.maxPrice = this.sliderMax;
    this.buildingCode = null;
    this.searchText = '';
    this.currentPage = 0;
    this.applyFiltersAndPagination();
    this.cdr.detectChanges();
  }

  // Track function cho ngFor
  trackByRoomId(index: number, room: RoomModel): number {
    return room.roomID;
  }

  handleImageError(room: RoomModel): void {
    room.urlImage = '../../../assets/images/room-placeholder.svg';
    this.cdr.detectChanges();
  }

  handleAvatarError(room: RoomModel, index: number): void {
    room.urlAvatars[index] = '../../../assets/images/avatar_error.svg';
    this.cdr.detectChanges();
  }

  showMoreAvatars(room: RoomModel): void {
    // Implement avatar dialog
    console.log('Show more avatars for room:', room.roomID);
  }

  viewRoomDetail(id: number): void {
    this.dialog.open(RoomDetail, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: id,
    });

    // this.roomService.getRoomById(id).subscribe({
    //   next: (data) => {},
    //   error: (error) => {
    //     console.error('Error loading room detail:', error);
    //   },
    // });
  }

  onClick_btnCreate(): void {
    const dialogRef = this.dialog.open(AddRoom, {
      height: 'auto',
      maxHeight: '90vh',
      minWidth: '60vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAllRooms();
      }
    });
  }

  @ViewChild('filterPanel') filterPanelRef!: ElementRef;

  toggleFilter(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
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

  // Thêm method để real-time filter khi thay đổi slider
  onPriceRangeChange(): void {
    // Debounce để tránh gọi quá nhiều lần
    if (this.priceChangeTimeout) {
      clearTimeout(this.priceChangeTimeout);
    }

    this.priceChangeTimeout = setTimeout(() => {
      this.currentPage = 0;
      this.applyFiltersAndPagination();
      this.cdr.detectChanges();
    }, 300);
  }

  private priceChangeTimeout: any;

  // Thêm method để real-time filter khi thay đổi building
  onBuildingChange(): void {
    this.currentPage = 0;
    this.applyFiltersAndPagination();
    this.cdr.detectChanges();
  }
}
