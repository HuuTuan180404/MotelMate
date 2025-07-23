import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from './confirm-dialog/confirm-dialog';

export interface ServiceTier {
  serviceTierID?: number;
  fromQuantity: number;
  toQuantity: number;
  govUnitPrice: number;
}

export interface ServiceItem {
  serviceID: number;
  name: string;
  unit: string;
  customerPrice: number;
  initialPrice: number;
  isTiered: boolean;
  serviceTier?: ServiceTier[];
}

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './service.html',
  styleUrl: './service.css'
})

export class Service {
  services: ServiceItem[] = [
    {
      serviceID: 1,
      name: 'Electricity',
      unit: 'kWh',
      customerPrice: 3500,
      initialPrice: 2000,
      isTiered: true,
      serviceTier: [
        { fromQuantity: 0, toQuantity: 50, govUnitPrice: 1500 },
        { fromQuantity: 51, toQuantity: 100, govUnitPrice: 1800 }
      ]
    },
    {
      serviceID: 2,
      name: 'WiFi',
      unit: 'tháng',
      customerPrice: 100000,
      initialPrice: 50000,
      isTiered: false
    }
  ];
  editingServiceID: number | null = null;
  displayedColumns: string[] = ['name', 'unit', 'initialPrice', 'customerPrice', 'actions'];
  dataSource = new MatTableDataSource<ServiceItem>(this.services);

  // Search term and filters
  searchTerm: string = '';
  filters = {
    isTiered: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  applyFilters() {
    this.dataSource.filter = JSON.stringify({
      searchTerm: this.searchTerm.trim().toLowerCase(),
      isTiered: this.filters.isTiered
    });
  }

  openCreateForm() {
    // TODO: Open dialog to create new service
    console.log('Open create form');
  }

  deleteService(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this service?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.services = this.services.filter(s => s.serviceID !== id);
        this.dataSource.data = this.services;
        this.applyFilters(); 
        this.snackBar.open('Service deleted.', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: 'custom-snackbar-success'
        });
      }
    });
  }
  startEdit(service: ServiceItem) {
  this.editingServiceID = service.serviceID;
  }

  cancelEdit() {
    this.editingServiceID = null;
  }

  saveEdit(service: ServiceItem) {
    if (!service.unit.trim()) {
      this.snackBar.open('Unit must not be empty.', 'Close', { duration: 3000, verticalPosition: 'top', panelClass: 'custom-snackbar'});
      return;
    }
    if (service.customerPrice <= 0) {
      this.snackBar.open('Customer price must be greater than 0.', 'Close', { duration: 3000, verticalPosition: 'top', panelClass: 'custom-snackbar' });
      return;
    }
    if (service.isTiered && service.serviceTier) {
      for (let i = 0; i < service.serviceTier.length; i++) {
        const tier = service.serviceTier[i];
        if (tier.fromQuantity >= tier.toQuantity) {
          this.snackBar.open(`Tier ${i + 1}: From quantity must be less than to quantity.`, 'Close', { duration: 3000, verticalPosition: 'top', panelClass: 'custom-snackbar' });
          return;
        }
        if (tier.govUnitPrice <= 0) {
          this.snackBar.open(`Tier ${i + 1}: Unit price must be greater than 0.`, 'Close', { duration: 3000 , verticalPosition: 'top', panelClass: 'custom-snackbar'});
          return;
        }
        for (let j = 0; j < service.serviceTier.length; j++) {
          if (i !== j) {
            const other = service.serviceTier[j];
            if (
              (tier.fromQuantity <= other.toQuantity && tier.fromQuantity >= other.fromQuantity) ||
              (tier.toQuantity <= other.toQuantity && tier.toQuantity >= other.fromQuantity)
            ) {
              this.snackBar.open(`Tier ${i + 1} overlaps with tier ${j + 1}.`, 'Close', { duration: 3000, verticalPosition: 'top', panelClass: 'custom-snackbar' });
              return;
            }
          }
        }
      }
      service.serviceTier.sort((a, b) => a.fromQuantity - b.fromQuantity);
    }

    this.editingServiceID = null;
    this.dataSource.data = [...this.services];
    this.snackBar.open('Saved successfully', 'Close', { duration: 2000 , verticalPosition: 'top', panelClass: 'custom-snackbar-success'});
  }

  addTier(service: any): void {
    if (!service.serviceTier) {
      service.serviceTier = [];
    }

    service.serviceTier.push({
      fromQuantity: 0,
      toQuantity: 0,
      govUnitPrice: 0
    });
  }


  private customFilterPredicate() {
    return (data: ServiceItem, filter: string): boolean => {
      const f = JSON.parse(filter);

      const matchesSearch =
        data.name.toLowerCase().includes(f.searchTerm) ||
        data.unit.toLowerCase().includes(f.searchTerm);

      const matchesTiered =
        f.isTiered === '' || String(data.isTiered) === f.isTiered;

      return matchesSearch && matchesTiered;
    };
  }
}