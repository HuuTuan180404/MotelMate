import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface Contract {
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
  templateUrl: './contractList.html',
  styleUrls: ['./contractList.css'],
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
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
})
export class ContractComponent implements OnInit, AfterViewInit  {
  displayedColumns: string[] = ['building', 'room', 'start', 'end', 'deposit', 'total', 'status'];
  dataSource = new MatTableDataSource<Contract>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  contracts: Contract[] = [
    { building: 'ABCHome', room: 201, start: '1/6/2025', end: '10/7/2025', deposit: 100000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '2/2/2025', end: '10/6/2025', deposit: 100000, total: 1100000, status: 'Active' },
    { building: 'QHome', room: 101, start: '2/7/2025', end: '10/8/2025', deposit: 100000, total: 3000000, status: 'Active' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 200000, total: 3000000, status: 'Active' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 300000, total: 3000000, status:  'Active'},
    { building: 'ABCHome', room: 201, start: '2/6/2025', end: '10/7/2025', deposit: 400000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '2/6/2025', end: '10/6/2025', deposit: 1500000, total: 1100000, status: 'Expire' },
    { building: 'QHome', room: 101, start: '2/6/2025', end: '10/8/2025', deposit: 2500000, total: 3000000, status: 'Terminate' },
    { building: 'QHome', room: 102, start: '2/6/2025', end: '10/8/2025', deposit: 3100000, total: 3000000, status: 'Unsigned' },
    { building: 'QHome', room: 102, start: '2/6/2025', end: '10/8/2025', deposit: 3200000, total: 3000000, status: 'Terminate'},
    { building: 'ABCHome', room: 201, start: '2/6/2025', end: '10/7/2025', deposit: 100000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '2/5/2025', end: '10/6/2025', deposit: 100000, total: 1100000, status: 'Expire' },
    { building: 'QHome', room: 101, start: '2/7/2025', end: '10/8/2025', deposit: 100000, total: 3000000, status: 'Terminate' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 200000, total: 3000000, status: 'Unsigned' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 300000, total: 3000000, status:  'Terminate'},
    { building: 'ABCHome', room: 201, start: '2/6/2025', end: '10/7/2025', deposit: 400000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '2/5/2025', end: '10/6/2025', deposit: 1500000, total: 1100000, status: 'Expire' },
    { building: 'QHome', room: 101, start: '2/7/2025', end: '10/8/2025', deposit: 2500000, total: 3000000, status: 'Terminate' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 3100000, total: 3000000, status: 'Unsigned' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 3200000, total: 3000000, status: 'Terminate'},
    { building: 'ABCHome', room: 201, start: '2/6/2025', end: '10/7/2025', deposit: 100000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '2/5/2025', end: '10/6/2025', deposit: 100000, total: 1100000, status: 'Expire' },
    { building: 'QHome', room: 101, start: '2/7/2025', end: '10/8/2025', deposit: 100000, total: 3000000, status: 'Terminate' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 200000, total: 3000000, status: 'Unsigned' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 300000, total: 3000000, status:  'Terminate'},
    { building: 'ABCHome', room: 201, start: '2/6/2025', end: '10/7/2025', deposit: 400000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '2/5/2025', end: '10/6/2025', deposit: 1500000, total: 1100000, status: 'Expire' },
    { building: 'QHome', room: 101, start: '2/7/2025', end: '10/8/2025', deposit: 2500000, total: 3000000, status: 'Terminate' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 3100000, total: 3000000, status: 'Unsigned' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 3200000, total: 3000000, status: 'Terminate'},
    { building: 'ABCHome', room: 201, start: '2/6/2025', end: '10/7/2025', deposit: 100000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '2/5/2025', end: '10/6/2025', deposit: 100000, total: 1100000, status: 'Expire' },
    { building: 'QHome', room: 101, start: '2/7/2025', end: '10/8/2025', deposit: 100000, total: 3000000, status: 'Terminate' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 200000, total: 3000000, status: 'Unsigned' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 300000, total: 3000000, status:  'Terminate'},
    { building: 'ABCHome', room: 201, start: '2/6/2025', end: '10/7/2025', deposit: 400000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '2/5/2025', end: '10/6/2025', deposit: 1500000, total: 1100000, status: 'Expire' },
    { building: 'QHome', room: 101, start: '2/7/2025', end: '10/8/2025', deposit: 2500000, total: 3000000, status: 'Terminate' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 3100000, total: 3000000, status: 'Unsigned' },
    { building: 'QHome', room: 102, start: '2/7/2025', end: '10/8/2025', deposit: 3200000, total: 3000000, status: 'Terminate'},
  ];

  filteredcontracts: Contract[] = [];
  pageSize = 5;
  pageIndex = 0;
  searchTerm = '';

  buildings = ['ABCHome', 'QHome'];
  rooms = [101, 102, 201, 310];
  statuses = ['Active', 'Expire', 'Terminate', 'Unsigned'];

  filters = {
    building: '',
    room: '',
    status: '',
    startDate: null,
    endDate: null
  };

  constructor() { }

  ngOnInit(): void {
    this.applyFilters();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnChanges() {
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
  
  applyFilters() {
    this.filteredcontracts = this.contracts.filter(con => {
      // Apply search term filter
      const searchMatch = !this.searchTerm ||
        con.building.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        con.room.toString().includes(this.searchTerm.toLowerCase()) ||
        con.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        con.start.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        con.end.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        con.deposit.toString().includes(this.searchTerm.toLowerCase()) ||
        con.total.toString().includes(this.searchTerm.toLowerCase());

      // Apply dropdown filters
      const filterMatch =
        (!this.filters.building || con.building === this.filters.building) &&
        (!this.filters.status || con.status === this.filters.status);

      const startDate = this.filters.startDate ? new Date(this.filters.startDate) : null;
      const endDate = this.filters.endDate ? new Date(this.filters.endDate) : null;
      if (startDate) {
        startDate.setHours(0, 0, 0, 0);
      }
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }

      const startParts = con.start.split('/');
      const contractStartDate = new Date(
        parseInt(startParts[2], 10),
        parseInt(startParts[0], 10) - 1,
        parseInt(startParts[1], 10)
      );

      const endParts = con.end.split('/');
      const contractEndDate = new Date(
        parseInt(endParts[2], 10),
        parseInt(endParts[0], 10) - 1,
        parseInt(endParts[1], 10)
      );

      const dateMatch = (!startDate || contractStartDate >= startDate) &&
                  (!endDate || contractEndDate <= endDate);

      return searchMatch && filterMatch && dateMatch;
    });

        // Reset to first page when filters change
    this.dataSource.data = this.filteredcontracts;
    if (this.paginator) {
      this.paginator.firstPage();
    }

  }

  clearFilters() {
    this.searchTerm = '';
    this.filters = {
      building: '',
      room: '',
      status: '',
      startDate: null,
      endDate: null
    };
    this.applyFilters();
  }

  exportPDF() {
    // Logic to export as PDF will be implemented here.
    console.log('Exporting to PDF...');
  }
}


