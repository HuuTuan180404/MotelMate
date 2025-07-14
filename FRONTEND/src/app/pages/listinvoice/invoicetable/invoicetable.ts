import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface Invoice {
  building: string;
  room: string;
  month: string;
  dueDate: Date;
  amount: number;
  status: string;
}

const INVOICE_DATA: Invoice[] = [
  { building: 'ABCHome', room: '201', month: '6/2025', dueDate: new Date('2025-07-10'), amount: 2000000, status: 'Paid' },
  { building: 'QHome', room: '310', month: '5/2025', dueDate: new Date('2025-06-10'), amount: 1100000, status: 'Overdue' },
  { building: 'QHome', room: '101', month: '7/2025', dueDate: new Date('2025-08-10'), amount: 3000000, status: 'Unpaid' }
];



@Component({
  selector: 'app-invoicetable',
  standalone: true,
  templateUrl: './invoicetable.html',
  styleUrls: ['./invoicetable.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
// export class Invoicetable implements AfterViewInit {
//   displayedColumns = ['building', 'room', 'month', 'dueDate', 'amount', 'status'];
//   dataSource = new MatTableDataSource<Invoice>(INVOICE_DATA);

//   @ViewChild(MatPaginator) paginator!: MatPaginator;

//   filter = {
//   building: '',
//   room: '',
//   date: null,
//   status: ''
//   };

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//   }

//   getStatusColor(status: string): string {
//     switch (status.toLowerCase()) {
//       case 'paid':
//         return 'primary';
//       case 'overdue':
//         return 'warn';
//       case 'unpaid':
//         return 'accent';
//       default:
//         return '';
//     }
//   }

//   clearFilters() {
//     // TODO: Clear filters logic
//   }

//   export() {
//     // TODO: Export logic
//   }
// }
export class Invoicetable implements AfterViewInit {
  displayedColumns = ['building', 'room', 'month', 'dueDate', 'amount', 'status'];
  dataSource = new MatTableDataSource<Invoice>(INVOICE_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // 👉 THÊM VÀO ĐÂY
  buildings: string[] = ['ABCHome', 'QHome'];
  rooms: string[] = ['101', '201', '310'];
  total = INVOICE_DATA.length;

  filter = {
    building: '',
    room: '',
    date: null,
    status: ''
  };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'primary';
      case 'overdue':
        return 'warn';
      case 'unpaid':
        return 'accent';
      default:
        return '';
    }
  }

  clearFilters() {
    // TODO: Clear filters logic
  }

  export() {
    // TODO: Export logic
  }
}
