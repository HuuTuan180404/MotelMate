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
import { AddBuilding } from './add-building/add-building';
import { environment } from '../../../environments/environment';

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
  editingBuildingID: number | null = null;
  originalBuilding: Building | null = null;


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
  startEdit(building: Building) {
    this.editingBuildingID = building.buildingID;
    this.originalBuilding = JSON.parse(JSON.stringify(building));
  }

  cancelEdit() {
    if (this.originalBuilding) {
      const index = this.buildings.findIndex(b => b.buildingID === this.originalBuilding!.buildingID);
      if (index !== -1) {
        this.buildings[index] = { ...this.originalBuilding! };  // Khôi phục lại dữ liệu cũ
        this.applyFilters();
      }
    }
    this.editingBuildingID = null;
    this.originalBuilding = null;
    this.buildings.forEach(b => b.previewImage = null);
  }

  async onImageSelected(event: Event, building: Building) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      
      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        building.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', environment.cloudinary.uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        building.imageURL = data.secure_url;
      } else {
        console.error('Image upload failed');
      }
    }
  }


  saveEdit(building: Building) {
    const hasChanges = JSON.stringify(this.originalBuilding) !== JSON.stringify(building);

    if (!hasChanges) {
      this.snackBar.open('No changes detected.', 'Close', {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: 'custom-snackbar-success'
      });
      this.editingBuildingID = null;
      this.originalBuilding = null;
      return;
    }

    if (!building.name.trim()) {
      this.snackBar.open('Name must not be empty.', 'Close', { duration: 3000, verticalPosition: 'top', panelClass: 'custom-snackbar' });
      return;
    }

    if (!building.address.trim()) {
      this.snackBar.open('Address must not be empty.', 'Close', { duration: 3000, verticalPosition: 'top', panelClass: 'custom-snackbar' });
      return;
    }

    this.buildingService.updateBuilding(building.buildingID, {
      name: building.name,
      address: building.address,
      imageURL: building.imageURL
    }).subscribe({
      next: () => {
        this.snackBar.open('Building updated successfully.', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: 'custom-snackbar-success'
        });
        building.previewImage = null;
        this.editingBuildingID = null;
        this.originalBuilding = null;
      },
      error: (err) => {
        console.error('Failed to update building', err);
        this.snackBar.open('Failed to update building.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: 'custom-snackbar'
        });
      }
    });
  }

  openAddBuildingDialog() {
    const dialogRef = this.dialog.open(AddBuilding, {
      panelClass: 'custom-dialog-panel',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buildingService.addBuilding(result).subscribe({
          next: (newBuilding) => {
            this.buildings.push(newBuilding);
            this.searchTerm = '';
            this.applyFilters();
            this.snackBar.open('Building added successfully.', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar-success'
            });
          },
          error: (err) => {
            console.error('Failed to add building', err);
            this.snackBar.open('Failed to add building.', 'Close', {
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