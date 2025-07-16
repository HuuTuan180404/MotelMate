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
    MatSortModule
  ],
})
export class ContractComponent implements OnInit, AfterViewInit  {
  displayedColumns: string[] = ['building', 'room', 'start', 'end', 'deposit', 'total', 'status'];
  dataSource = new MatTableDataSource<Contract>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  contracts: Contract[] = [
    { building: 'ABCHome', room: 201, start: '6/2025', end: '10/7/2025', deposit: 100000, total: 2000000, status: 'Active' },
    { building: 'QHome', room: 310, start: '5/2025', end: '10/6/2025', deposit: 100000, total: 1100000, status: 'Active' },
    { building: 'QHome', room: 101, start: '7/2025', end: '10/8/2025', deposit: 100000, total: 3000000, status: 'Active' },
    { building: 'QHome', room: 102, start: '7/2025', end: '10/8/2025', deposit: 200000, total: 3000000, status: 'Active' },
    { building: 'QHome', room: 102, start: '7/2025', end: '10/8/2025', deposit: 300000, total: 3000000, status:  'Active'},
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
    status: ''
  };

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.contracts);
    this.applyFilters();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.dataSource.data = this.filteredcontracts;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

}
