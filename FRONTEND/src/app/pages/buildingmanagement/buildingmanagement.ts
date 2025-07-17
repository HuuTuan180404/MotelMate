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
import { Building } from './building/building';
import { MatButtonModule } from '@angular/material/button';

interface BuildingInfo {
  code: string;
  building: string;
  address: string;
  tenants: number;
  rooms: number;
  available: number;
  occupied: number;
  maintenance: number;
}

@Component({
  selector: 'app-buildingmanagement',
  imports: [
    Building,
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
  filters = {
    building: '',
    status: '',
    startDate: '',
    endDate: '',
  };

  buildings: BuildingInfo[] = [];
  filteredbuilding: BuildingInfo[] = [];

  // 👉 Biến điều khiển form thêm mới
  isAddFormVisible: boolean = false;

  // 👉 Dữ liệu form thêm
  newBuilding: Partial<BuildingInfo> = {
    building: '',
    address: '',
  };

  BUILDINGS: BuildingInfo[] = [
    {
      code: 'B003',
      building: 'Greenland Building',
      address: '78 Lê Lợi, Q.3, TP.HCM',
      tenants: 10,
      rooms: 15,
      available: 4,
      occupied: 10,
      maintenance: 1,
    },
    {
      code: 'B002',
      building: 'Riverside Complex',
      address: '8 Trường Sa, Thiện Đức Bắc, Hoài Hương, Hoài Nhơn, Bình Định, Việt Nam',
      tenants: 20,
      rooms: 30,
      available: 8,
      occupied: 21,
      maintenance: 1,
    },
    {
      code: 'B002',
      building: 'Riverside Complex',
      address: '8 Trường Sa, Thiện Đức Bắc, Hoài Hương, Hoài Nhơn, Bình Định, Việt Nam',
      tenants: 20,
      rooms: 30,
      available: 8,
      occupied: 21,
      maintenance: 1,
    },
    {
      code: 'B002',
      building: 'Riverside Complex',
      address: '8 Trường Sa, Thiện Đức Bắc, Hoài Hương, Hoài Nhơn, Bình Định, Việt Nam',
      tenants: 20,
      rooms: 30,
      available: 8,
      occupied: 21,
      maintenance: 1,
    },
  ];

  ngOnInit(): void {
    this.buildings = [...this.BUILDINGS]; // Clone data
    this.applyFilters();
  }

  applyFilters() {
    this.filteredbuilding = this.buildings.filter(con => {
      const searchLower = this.searchTerm?.toLowerCase() || '';
      const searchMatch =
        !this.searchTerm ||
        con.building.toLowerCase().includes(searchLower) ||
        con.code.toLowerCase().includes(searchLower) ||
        con.address.toLowerCase().includes(searchLower);
      return searchMatch;
    });
  }
  openAddForm() {
    this.isAddFormVisible = true;
  }

  cancelAdd() {
    this.isAddFormVisible = false;
    this.newBuilding = { building: '', address: '' };
  }

  addBuilding() {
    if (!this.newBuilding.building?.trim() || !this.newBuilding.address?.trim()) {
      return;
    }

    const newItem: BuildingInfo = {
      code: `B${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      building: this.newBuilding.building,
      address: this.newBuilding.address,
      tenants: 0,
      rooms: 0,
      available: 0,
      occupied: 0,
      maintenance: 0,
    };

    this.buildings.unshift(newItem);
    this.applyFilters();
    this.cancelAdd();
  }
}
