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
import { InvoiceDetail } from './invoice-detail/invoice-detail';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvoiceCreateForm } from './invoice-create-form/invoice-create-form';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';

export interface Invoice {
  invoiceCode: string;
  building: string;
  room: number;
  month: string;
  due: string;
  createAt: string;
  periodStart: string;
  periodEnd: string;
  extraCosts: { description: string; amount: number }[];
  services: { name: string; quantity: number; unit: string; initialPrice: number; customerPrice: number }[];
  total: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
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
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDateRangeInput,   
    MatDateRangePicker
  ],
  templateUrl: './listinvoice.html',
  styleUrl: './listinvoice.css'
})
export class Listinvoice {
  invoices: Invoice[] = [
    {
    invoiceCode: 'INV001',
    building: 'ABCHome',
    room: 201,
    month: '6/2025',
    due: '07/10/2025',
    createAt: '07/01/2025',
    periodStart: '06/01/2025',
    periodEnd: '06/30/2025',
    extraCosts: [
      { description: 'Maintenance fee', amount: 500000 }
    ],
    services: [
  { name: 'Electricity', quantity: 50, unit: 'kWh', initialPrice: 100000, customerPrice: 150000 },
  { name: 'WiFi', quantity: 1, unit: 'tháng', initialPrice: 50000, customerPrice: 100000 }
],
    total: 2000000,
    status: 'Unpaid'
  },
  {
    invoiceCode: 'INV002',
    building: 'ABCHome',
    room: 202,
    month: '6/2025',
    due: '07/10/2025',
    createAt: '07/01/2025',
    periodStart: '06/01/2025',
    periodEnd: '06/30/2025',
    extraCosts: [],
   services: [
  { name: 'Electricity', quantity: 50, unit: 'kWh', initialPrice: 100000, customerPrice: 150000 },
  { name: 'WiFi', quantity: 1, unit: 'tháng', initialPrice: 50000, customerPrice: 100000 }
]
,
    total: 1200000,
    status: 'Paid'
  },
  {
    invoiceCode: 'INV003',
    building: 'SkyVilla',
    room: 305,
    month: '6/2025',
    due: '07/10/2025',
    createAt: '07/01/2025',
    periodStart: '06/01/2025',
    periodEnd: '06/30/2025',
    extraCosts: [
      { description: 'Repair', amount: 300000 }
    ],
   services: [
  { name: 'Electricity', quantity: 50, unit: 'kWh', initialPrice: 100000, customerPrice: 150000 },
  { name: 'WiFi', quantity: 1, unit: 'tháng', initialPrice: 50000, customerPrice: 100000 }
]
,
    total: 2500000,
    status: 'Overdue'
  }

  ];

  dataSource = new MatTableDataSource<Invoice>();
  displayedColumns: string[] = ['building', 'room', 'month', 'due', 'total', 'status'];

  searchTerm = '';
  buildings = ['ABCHome', 'QHome'];
  rooms = [101, 102, 201, 310];
  statuses = ['Paid', 'Overdue', 'Unpaid'];

  filters = {
    building: '',
    room: '',
    status: '',
    startDate: null,
    endDate: null
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {}

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
        (!this.filters.status || inv.status === this.filters.status);

      const startDate = this.filters.startDate ? new Date(this.filters.startDate) : null;
      const endDate = this.filters.endDate ? new Date(this.filters.endDate) : null;

      if (startDate) {
        startDate.setHours(0, 0, 0, 0);
      }
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }

      const startParts = inv.due.split('/');
      const invoiceDueDate = new Date(
        parseInt(startParts[2], 10),
        parseInt(startParts[0], 10) - 1,
        parseInt(startParts[1], 10)
      );
      const dateMatch = (!startDate || invoiceDueDate >= startDate) &&
                  (!endDate || invoiceDueDate <= endDate);

      return searchMatch && filterMatch && dateMatch;
    });

    this.dataSource.data = filtered;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  clearAllFilters() {
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

  exportInvoices() {
    const rows = this.dataSource.data;
    const header = ['Building', 'Room', 'Month', 'Due', 'Total', 'Status'];
    const csvRows = [
      header.join(','),
      ...rows.map(inv =>
        [inv.building, inv.room, inv.month, inv.due, inv.total, inv.status].join(',')
      )
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'invoices.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openInvoiceDetail(inv: Invoice) {
    this.dialog.open(InvoiceDetail, {
      width: '400px',
      data: inv
    });
  }
  openCreateForm() {
    const dialogRef = this.dialog.open(InvoiceCreateForm, {
      panelClass: 'custom-dialog-panel',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.invoices.push(result);
        this.applyFilters();
      }
    });
  }
}
