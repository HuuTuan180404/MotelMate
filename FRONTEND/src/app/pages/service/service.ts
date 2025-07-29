import { Component, ViewChild, OnInit } from '@angular/core';
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
import { CreateServiceDialog } from './create-service-dialog/create-service-dialog';
import { ServiceItem } from '../../models/Service.model';
import { ServiceService } from '../../services/service';


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

export class Service implements OnInit{
  services: ServiceItem[] = [];
  originalService: ServiceItem | null = null;
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
    private snackBar: MatSnackBar,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.fetchServices();
  }
  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }
  fetchServices(): void {
    this.serviceService.getAllServices().subscribe({
      next: (data) => {
        this.services = data;
        this.dataSource.data = [...this.services];
        // this.dataSource.paginator = this.paginator;  
        // this.dataSource.sort = this.sort;    
        setTimeout(() => {  
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to fetch services', err);
        this.snackBar.open('Failed to load services.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: 'custom-snackbar'
        });
      }
    });
  }
  applyFilters() {
    this.dataSource.filter = JSON.stringify({
      searchTerm: this.searchTerm.trim().toLowerCase(),
      isTiered: this.filters.isTiered
    });
  }

  openCreateForm() {
    const dialogRef = this.dialog.open(CreateServiceDialog, {
      panelClass: 'custom-dialog-panel',
    });
      dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Sending CreateService:', result); 
        this.serviceService.createService(result).subscribe({
          next: (newService) => {
            this.services.push(newService);
            this.dataSource.data = [...this.services];
            this.applyFilters();
            this.snackBar.open('Service created successfully.', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar-success'
            });
          },
          error: (err) => {
            console.error('Failed to create service', err);
            this.snackBar.open('Failed to create service.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar'
            });
          }
        });
      }
    });
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
        this.serviceService.deleteService(id).subscribe({
          next: () => {
            this.services = this.services.filter(s => s.serviceID !== id);
            this.dataSource.data = [...this.services];
            this.applyFilters();
            this.snackBar.open('Service deleted.', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar-success'
            });
          },
          error: (err) => {
            console.error('Failed to delete service', err);
            this.snackBar.open('Failed to delete service.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar'
            });
          }
        });
      }
    });
  }
  startEdit(service: ServiceItem) {
    this.editingServiceID = service.serviceID;
    this.originalService = JSON.parse(JSON.stringify(service));
  }

  cancelEdit() {
    if (this.originalService) {
      const index = this.services.findIndex(s => s.serviceID === this.originalService!.serviceID);
      if (index !== -1) {
        this.services[index] = this.originalService!;
        this.dataSource.data = [...this.services];
      }
    }
    this.editingServiceID = null;
    this.originalService = null;
  }

  saveEdit(service: ServiceItem) {
    const hasChanges = JSON.stringify(this.originalService) !== JSON.stringify(service);

    if (!hasChanges) {
      this.snackBar.open('No changes detected.', 'Close', {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: 'custom-snackbar-success'
      });
      this.editingServiceID = null;
      this.originalService = null;
      return;
    }

    if (!service.unit.trim()) {
      this.snackBar.open('Unit must not be empty.', 'Close', { duration: 3000, verticalPosition: 'top', panelClass: 'custom-snackbar'});
      return;
    }
    if (service.customerPrice <= 0) {
      this.snackBar.open('Customer price must be greater than 0.', 'Close', { duration: 3000, verticalPosition: 'top', panelClass: 'custom-snackbar' });
      return;
    }
    if (service.initialPrice <= 0) {
      this.snackBar.open('Initial price must be greater than 0.', 'Close', { duration: 3000, verticalPosition: 'top', panelClass: 'custom-snackbar' });
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

    this.serviceService.editService(service).subscribe({
      next: () => {
        this.dataSource.data = [...this.services];
        this.editingServiceID = null;
        this.originalService = null;
        this.snackBar.open('Saved successfully', 'Close', { duration: 2000 , verticalPosition: 'top', panelClass: 'custom-snackbar-success'});
      },
      error: (err) => {
        console.error('Failed to save service', err);
        this.snackBar.open('Failed to save service.', 'Close', { duration: 3000, verticalPosition: 'top', panelClass: 'custom-snackbar' });
      }
    });
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