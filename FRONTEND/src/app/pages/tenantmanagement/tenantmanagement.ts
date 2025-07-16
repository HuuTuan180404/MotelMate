import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

interface Tenant {
  avatar: string;
  name: string;
  status: 'Active' | 'Terminate';
  contact: string;
  room: string;
  bdate: Date;
}

@Component({
  selector: 'app-tenantmanagement',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './tenantmanagement.html',
  styleUrl: './tenantmanagement.css',
})
export class TenantManagement implements AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'bdate',
    'contact',
    'building',
    'room',
    'status',
  ];

  tenants: Tenant[] = [
    {
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      contact: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      contact: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      contact: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      contact: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      contact: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      contact: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      contact: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      contact: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      contact: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      contact: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      contact: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      contact: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      contact: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      contact: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      contact: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      contact: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      name: 'Nguyễn Văn A',
      status: 'Active',
      contact: '0987654321',
      room: '101A',
      bdate: new Date('1995-03-15'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      name: 'Trần Thị B',
      status: 'Terminate',
      contact: '0912345678',
      room: '102B',
      bdate: new Date('1990-07-20'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/31.jpg',
      name: 'Lê Văn C',
      status: 'Terminate',
      contact: '0908123456',
      room: '201C',
      bdate: new Date('1988-12-01'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
      name: 'Phạm Thị D',
      status: 'Terminate',
      contact: '0934567890',
      room: '310D',
      bdate: new Date('1992-05-10'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
      name: 'Đỗ Văn E',
      status: 'Active',
      contact: '0977123456',
      room: '105E',
      bdate: new Date('1999-09-09'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
      name: 'Phạm Thị D',
      status: 'Terminate',
      contact: '0934567890',
      room: '310D',
      bdate: new Date('1992-05-10'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
      name: 'Đỗ Văn E',
      status: 'Active',
      contact: '0977123456',
      room: '105E',
      bdate: new Date('1999-09-09'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
      name: 'Phạm Thị D',
      status: 'Terminate',
      contact: '0934567890',
      room: '310D',
      bdate: new Date('1992-05-10'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
      name: 'Đỗ Văn E',
      status: 'Active',
      contact: '0977123456',
      room: '105E',
      bdate: new Date('1999-09-09'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
      name: 'Phạm Thị D',
      status: 'Terminate',
      contact: '0934567890',
      room: '310D',
      bdate: new Date('1992-05-10'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
      name: 'Đỗ Văn E',
      status: 'Active',
      contact: '0977123456',
      room: '105E',
      bdate: new Date('1999-09-09'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
      name: 'Phạm Thị D',
      status: 'Terminate',
      contact: '0934567890',
      room: '310D',
      bdate: new Date('1992-05-10'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
      name: 'Đỗ Văn E',
      status: 'Active',
      contact: '0977123456',
      room: '105E',
      bdate: new Date('1999-09-09'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
      name: 'Phạm Thị D',
      status: 'Terminate',
      contact: '0934567890',
      room: '310D',
      bdate: new Date('1992-05-10'),
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
      name: 'Đỗ Văn E',
      status: 'Active',
      contact: '0977123456',
      room: '105E',
      bdate: new Date('1999-09-09'),
    },
  ];

  dataSource: MatTableDataSource<Tenant> = new MatTableDataSource(this.tenants);

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
