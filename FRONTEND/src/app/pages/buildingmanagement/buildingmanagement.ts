import { Component, OnInit } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BuildingInfo {
  code: string;
  building: string;
  address: string;
  tenants: number;
  rooms: number;
  available: number;
  occupied: number;
  maintenance: number;
}

@Component({
  selector: 'app-buildingmanagement',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './buildingmanagement.html',
  styleUrl: './buildingmanagement.css',
})
export class Buildingmanagement implements OnInit {
  BUILDINGS: BuildingInfo[] = [
    {
      code: 'B001',
      building: 'Sunshine Tower',
      address: '123 Nguyễn Văn Cừ, Q.5, TP.HCM',
      tenants: 12,
      rooms: 20,
      available: 5,
      occupied: 14,
      maintenance: 1,
    },
    {
      code: 'B002',
      building: 'Riverside Complex',
      address:
        '8 Trường Sa, Thiện Đức Bắc, Hoài Hương, Hoài Nhơn, Bình Định, Việt Nam',
      tenants: 20,
      rooms: 30,
      available: 8,
      occupied: 21,
      maintenance: 1,
    },
    {
      code: 'B003',
      building: 'Greenland Building',
      address: '78 Lê Lợi, Q.3, TP.HCM',
      tenants: 10,
      rooms: 15,
      available: 4,
      occupied: 10,
      maintenance: 1,
    },
  ];

  filteredcontracts: BuildingInfo[] = [];
  pageSize = 5;
  pageIndex = 0;
  searchTerm = '';

  buildings: string[] = [];

  filters = {
    building: '',
  };

  ngOnInit(): void {
    this.applyFilters();
    this.buildings = [...new Set(this.BUILDINGS.map((b) => b.building))];
  }

  applyFilters() {
    this.filteredcontracts = this.BUILDINGS;
    //  this.BUILDINGS.filter((inv) => {
    // Apply search term filter
    // const searchMatch =
    //   !this.searchTerm ||
    //   inv.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    //   inv.building.toString().includes(this.searchTerm.toLowerCase()) ||
    //   inv.address.toLowerCase().includes(this.searchTerm.toLowerCase());

    // Apply dropdown filters
    // const filterMatch =
    //   (!this.filters.building || inv.building === this.filters.building) &&
    //   (!this.filters.room || inv.room.toString() === this.filters.room) &&
    //   (!this.filters.status || inv.status === this.filters.status);

    // return [];
    // });
    // Reset to first page when filters change
    this.pageIndex = 0;
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  onPageSizeChange() {
    this.pageIndex = 0; // Reset to first page when page size changes
  }

  goToPage(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < this.getTotalPages()) {
      this.pageIndex = pageIndex;
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredcontracts.length / this.pageSize);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];

    // Show maximum 5 page numbers
    const maxPages = 5;
    let startPage = Math.max(1, this.pageIndex + 1 - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
