import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface invoice {
  building: string;
  room: number;
  month: string;
  due: string;
  total: number;
  status: 'Paid' | 'Overdue' | 'Unpaid';
}

@Component({
  selector: 'app-listinvoice',
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
  templateUrl: './listinvoice.html',
  styleUrl: './listinvoice.css'
})
export class Listinvoice {
  invoices: invoice[] = [
    { building: 'ABCHome', room: 201, month: '6/2025', due: '10/7/2025', total: 2000000, status: 'Paid' },
    { building: 'ABCHome', room: 201, month: '7/2025', due: '10/8/2025', total: 4000000, status: 'Unpaid' },
    { building: 'QHome', room: 301, month: '5/2025', due: '10/6/2025', total: 3000000, status: 'Overdue' }
  ];

  dataSource = new MatTableDataSource<invoice>();
  displayedColumns: string[] = ['building', 'room', 'month', 'due', 'total', 'status'];

  searchTerm = '';
  buildings = ['ABCHome', 'QHome'];
  rooms = [101, 102, 201, 310];
  statuses = ['Paid', 'Overdue', 'Unpaid'];

  filters = {
    building: '',
    room: '',
    status: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.applyFilters();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters() {
    const filtered = this.invoices.filter(inv => {
      const searchMatch = !this.searchTerm ||
        inv.building.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inv.room.toString().includes(this.searchTerm.toLowerCase()) ||
        inv.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inv.month.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inv.due.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        inv.total.toString().includes(this.searchTerm.toLowerCase());

      const filterMatch =
        (!this.filters.building || inv.building === this.filters.building) &&
        (!this.filters.room || inv.room.toString() === this.filters.room) &&
        (!this.filters.status || inv.status === this.filters.status);

      return searchMatch && filterMatch;
    });

    this.dataSource.data = filtered;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
}
