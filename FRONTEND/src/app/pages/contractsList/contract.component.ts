import { Component, OnInit } from '@angular/core';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface contract {
  building: string;
  room: number;
  start: string;
  end: string;
  deposit: number;
  total: number;
  status: 'Active' | 'Expire' | 'Terminate' | 'Unsigned' ;
}

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css'],
  standalone: true,
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
})
export class contractComponent implements OnInit {

  contracts: contract[] = [
    { building: 'ABCHome', room: 201, start: '6/2025', end: '10/7/2025', deposit: 100000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '5/2025', end: '10/6/2025', deposit: 100000, total: 1100000, status: 'Expire' },
    { building: 'QHome', room: 101, start: '7/2025', end: '10/8/2025', deposit: 100000, total: 3000000, status: 'Terminate' },
    { building: 'QHome', room: 102, start: '7/2025', end: '10/8/2025', deposit: 200000, total: 3000000, status: 'Unsigned' },
    { building: 'QHome', room: 102, start: '7/2025', end: '10/8/2025', deposit: 300000, total: 3000000, status:  'Terminate'},
    { building: 'ABCHome', room: 201, start: '6/2025', end: '10/7/2025', deposit: 400000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '5/2025', end: '10/6/2025', deposit: 1500000, total: 1100000, status: 'Expire' },
    { building: 'QHome', room: 101, start: '7/2025', end: '10/8/2025', deposit: 2500000, total: 3000000, status: 'Terminate' },
    { building: 'QHome', room: 102, start: '7/2025', end: '10/8/2025', deposit: 3100000, total: 3000000, status: 'Unsigned' },
    { building: 'QHome', room: 102, start: '7/2025', end: '10/8/2025', deposit: 3200000, total: 3000000, status: 'Terminate'},
    { building: 'ABCHome', room: 201, start: '6/2025', end: '10/7/2025', deposit: 100000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '5/2025', end: '10/6/2025', deposit: 100000, total: 1100000, status: 'Expire' },
    { building: 'QHome', room: 101, start: '7/2025', end: '10/8/2025', deposit: 100000, total: 3000000, status: 'Terminate' },
    { building: 'QHome', room: 102, start: '7/2025', end: '10/8/2025', deposit: 200000, total: 3000000, status: 'Unsigned' },
    { building: 'QHome', room: 102, start: '7/2025', end: '10/8/2025', deposit: 300000, total: 3000000, status:  'Terminate'},
    { building: 'ABCHome', room: 201, start: '6/2025', end: '10/7/2025', deposit: 400000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '5/2025', end: '10/6/2025', deposit: 1500000, total: 1100000, status: 'Expire' },
    { building: 'QHome', room: 101, start: '7/2025', end: '10/8/2025', deposit: 2500000, total: 3000000, status: 'Terminate' },
    { building: 'QHome', room: 102, start: '7/2025', end: '10/8/2025', deposit: 3100000, total: 3000000, status: 'Unsigned' },
    { building: 'QHome', room: 102, start: '7/2025', end: '10/8/2025', deposit: 3200000, total: 3000000, status: 'Terminate'},
  ];

  filteredcontracts: contract[] = [];
  pageSize = 5;
  pageIndex = 0;
  searchTerm = '';

  buildings = ['ABCHome', 'QHome'];
  rooms = [101, 102, 201, 310];
  statuses = ['Active', 'Expire', 'Terminate', 'Unsigned'];

  filters = {
    building: '',
    room: '',
    status: ''
  };

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredcontracts = this.contracts.filter(inv => {
      // Apply search term filter
      const searchMatch = !this.searchTerm ||
        inv.building.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inv.room.toString().includes(this.searchTerm.toLowerCase()) ||
        inv.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inv.start.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inv.end.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inv.deposit.toString().includes(this.searchTerm.toLowerCase()) ||
        inv.total.toString().includes(this.searchTerm.toLowerCase());

      // Apply dropdown filters
      const filterMatch =
        (!this.filters.building || inv.building === this.filters.building) &&
        (!this.filters.room || inv.room.toString() === this.filters.room) &&
        (!this.filters.status || inv.status === this.filters.status);

      return searchMatch && filterMatch;
    });

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
