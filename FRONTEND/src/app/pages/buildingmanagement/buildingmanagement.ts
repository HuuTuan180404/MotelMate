import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  Component,
  OnInit,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { Building } from '../../models/Building.model';
import { BuildingService } from '../../services/building-service';
import { ConfirmDialog } from '../service/confirm-dialog/confirm-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog'; 
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-buildingmanagement',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule, 
    MatDialogModule,

  ],
  templateUrl: './buildingmanagement.html',
  styleUrl: './buildingmanagement.css',
})
export class Buildingmanagement implements OnInit {
  searchTerm: string = '';
  buildings: Building[] = [];
  filteredbuilding: Building[] = [];

  constructor(private buildingService: BuildingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchBuildings();
  }

  fetchBuildings(): void {
    this.buildingService.getBuildings().subscribe({
      next: (data) => {
        this.buildings = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Failed to load buildings', err);
      }
    });
  }

  applyFilters() {
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredbuilding = this.buildings.filter(b =>
      b.name.toLowerCase().includes(searchLower) ||
      b.address.toLowerCase().includes(searchLower)
    );
  }
  deleteBuilding(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this buiding?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.buildingService.deleteBuilding(id).subscribe({
          next: () => {
            this.buildings = this.buildings.filter(b => b.buildingID !== id);
            this.applyFilters();
            this.snackBar.open('Building deleted.', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar-success'
            });
          },
          error: (err) => {
            console.error('Failed to delete building', err);
            this.snackBar.open('Failed to delete building.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar'
            });
          }
        });
      }
    });
  }
}