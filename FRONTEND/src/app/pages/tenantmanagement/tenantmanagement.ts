import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TenantModel } from '../../models/Tenant.model';
import { Room } from '../roommanagement/room/room';
import { TenantService } from '../../services/tenantservice';
import {
  HttpClient,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';

@Component({
  selector: 'app-tenantmanagement',
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  templateUrl: './tenantmanagement.html',
  styleUrl: './tenantmanagement.css',
})
export class TenantManagement implements AfterViewInit, OnInit {
  searchText: string = '';
  _tenants: TenantModel[] = [];
  _displayedColumns: string[] = [
    'cccd',
    // 'urlAvatar',
    'fullName',
    'bdate',
    'phoneNumber',
    'status',
  ];

  constructor(private tenantService: TenantService) {}

  ngOnInit(): void {
    this.tenantService.getAllTenants().subscribe((data) => {
      this._tenants = data.map(
        (x: any): TenantModel => ({
          tenantID: x.tenantID,
          fullName: x.fullName,
          phoneNumber: x.phoneNumber,
          bdate: x.bdate,
          urlAvatar: x.urlAvatar,
          status: x.status,
          cccd: x.cccd,
        })
      );
      this.dataSource.data = this._tenants; // ✅
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onClick_btnCreate() {
    console.log('create new tenant');
  }

  dataSource: MatTableDataSource<TenantModel> = new MatTableDataSource(
    this._tenants
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
