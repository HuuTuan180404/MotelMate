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
    MatButtonModule
  ],
  templateUrl: './buildingmanagement.html',
  styleUrl: './buildingmanagement.css',
})
export class Buildingmanagement implements OnInit {
  searchTerm: string = '';
  buildings: Building[] = [];
  filteredbuilding: Building[] = [];

  constructor(private buildingService: BuildingService) {}

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
}