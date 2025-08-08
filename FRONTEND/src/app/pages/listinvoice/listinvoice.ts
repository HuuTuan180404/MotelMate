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
import { InvoiceService } from '../../services/invoice-service';
import { ReadInvoice } from '../../models/Invoice.model';
import { ReadInvoiceDetail } from '../../models/Invoice.model';
import { ActivatedRoute } from '@angular/router';
import { Building } from '../../models/Building.model';
import { BuildingService } from '../../services/building-service';

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
  invoices: ReadInvoice[] = [];

  dataSource = new MatTableDataSource<ReadInvoice>();
  displayedColumns: string[] = ['building', 'room', 'month', 'due', 'total', 'status'];

  searchTerm = '';
  buildings: Building[] = []; 
  statuses = ['Paid', 'Overdue', 'Unpaid'];

  filters = {
    building: '',
    room: '',
    status: '',
    startDate: null,
    endDate: null
  };

  role: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private invoiceService: InvoiceService,
    private buildingService: BuildingService) {}

  ngOnInit(): void {
    this.role = this.route.snapshot.data['role'];

    if (this.role === 'owner') {
      this.invoiceService.getInvoices().subscribe({
        next: (data) => {
          this.invoices = data;
          this.applyFilters();
        },
        error: (err) => {
          console.error('Failed to fetch invoices', err);
        }
      });
    } else if (this.role === 'tenant') {
      this.invoiceService.getInvoicesForTenant().subscribe({
        next: (data) => {
          this.invoices = data;
          this.applyFilters();
        },
        error: (err) => {
          console.error('Failed to fetch tenant invoices', err);
        }
      });
    }

    this.buildingService.getBuildings().subscribe({
      next: (data) => {
        this.buildings = data;
      },
      error: (err) => console.error('Failed to fetch buildings', err)
    });
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
    if (this.role !== 'owner') return;

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

  
  openInvoiceDetail(inv: ReadInvoice) {
    this.invoiceService.getInvoiceDetail(inv.invoiceID).subscribe({
      next: (detail: ReadInvoiceDetail) => {
        const dialogRef = this.dialog.open(InvoiceDetail, {
          width: '600px',
          data: {
            ...detail,
            invoiceID: inv.invoiceID,
            role: this.role  
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result?.action === 'delete') {
            this.invoices = this.invoices.filter(i => i.invoiceID !== result.invoiceID);
            this.applyFilters();
          } else if (result?.action === 'edit') {
            const updated = result.invoice;
            const index = this.invoices.findIndex(i => i.invoiceID === updated.invoiceID);
            if (index !== -1) {
              this.invoices[index] = {
                ...this.invoices[index],
                total: updated.total,
                status: updated.status,
                due: updated.due
                // ✅ Nếu bạn cần update thêm trường nào thì thêm ở đây
              };
              this.applyFilters();
            }
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch invoice detail', err);
      }
    });
  }


  openCreateForm() {
    if (this.role !== 'owner') return;

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
