import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
  ],
  templateUrl: './tenantmanagement.html',
  styleUrl: './tenantmanagement.css',
})
export class TenantManagement implements AfterViewInit {
  searchText: string = '';

  onClick_btnCreate() {
    console.log('create new tenant');
  }

  displayedColumns: string[] = [
    'name',
    'bdate',
    'contact',
    'building',
    'room',
    'status',
  ];

  tenants: TenantModel[] = [
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      phoneNumber: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      phoneNumber: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      phoneNumber: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      phoneNumber: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      phoneNumber: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      phoneNumber: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      phoneNumber: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      phoneNumber: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      phoneNumber: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      phoneNumber: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      phoneNumber: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      phoneNumber: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      phoneNumber: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      phoneNumber: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      phoneNumber: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      phoneNumber: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      phoneNumber: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
  ];

  dataSource: MatTableDataSource<TenantModel> = new MatTableDataSource(
    this.tenants
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
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
}
