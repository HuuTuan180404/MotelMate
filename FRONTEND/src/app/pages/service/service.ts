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
    MatDialogModule
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

  displayedColumns: string[] = ['name', 'unit', 'initialPrice', 'customerPrice', 'actions'];
  dataSource = new MatTableDataSource<ServiceItem>(this.services);

  // Search term and filters
  searchTerm: string = '';
  filters = {
    isTiered: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {}

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

  editService(service: ServiceItem) {
    // TODO: Open dialog to edit selected service
    console.log('Edit service:', service);
  }

  deleteService(id: number) {
    this.services = this.services.filter(s => s.serviceID !== id);
    this.dataSource.data = this.services;
    this.applyFilters(); // update filters after deletion
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