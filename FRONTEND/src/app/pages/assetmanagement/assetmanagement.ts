import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Tenant } from '../../models/Tenant.model';
import { Asset } from '../../models/Asset.model';

@Component({
  selector: 'app-assetmanagement',
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
  templateUrl: './assetmanagement.html',
  styleUrl: './assetmanagement.css',
})
export class AssetManagement {
  searchText: string = '';

  displayedColumns: string[] = [
    'assetID',
    'name',
    'price',
    'type',
    'description',
    'quantity',
  ];

  onClick_btnCreate() {
    console.log('create new asset');
  }

  assets: Asset[] = [
    {
      assetID: 6,
      name: 'Tủ lạnh Samsung Inverter 256L',
      price: 7200000,
      description:
        'Tủ lạnh tiết kiệm điện, phù hợp sử dụng trong văn phòng nhỏ.',
      type: 'Electronics',
    },
    {
      assetID: 7,
      name: 'Xe máy Honda Wave Alpha',
      price: 18000000,
      description: 'Phương tiện đi lại cho nhân viên, tiết kiệm nhiên liệu.',
      type: 'Vehicle',
    },
    {
      assetID: 8,
      name: 'Máy chiếu Epson EB-X41',
      price: 9500000,
      description: 'Máy chiếu độ sáng cao, phù hợp cho thuyết trình hội họp.',
      type: 'Office Equipment',
    },
    {
      assetID: 9,
      name: 'Camera giám sát Hikvision 2MP',
      price: 1200000,
      description: 'Camera an ninh có hồng ngoại, giám sát 24/7.',
      type: 'Electronics',
    },
    {
      assetID: 10,
      name: 'Tủ tài liệu 3 ngăn',
      price: 1500000,
      description: 'Tủ tài liệu bằng sắt sơn tĩnh điện, khóa bảo mật.',
      type: 'Furniture',
    },
    {
      assetID: 11,
      name: 'Máy tính bàn Core i5 Gen10',
      price: 14000000,
      description: 'Cấu hình ổn định, dùng cho nhân viên văn phòng và kế toán.',
      type: 'Electronics',
    },
    {
      assetID: 12,
      name: 'Bảng trắng văn phòng 1.2m x 2m',
      price: 800000,
      description: 'Bảng từ trắng có bánh xe, dễ dàng di chuyển và ghi chú.',
      type: 'Office Equipment',
    },
    {
      assetID: 13,
      name: 'Ghế họp chân quỳ',
      price: 600000,
      description: 'Ghế họp đơn giản, khung sắt chắc chắn, đệm mút bọc da.',
      type: 'Furniture',
    },
    {
      assetID: 14,
      name: 'Máy pha cà phê Espresso Philips',
      price: 3100000,
      description:
        'Phù hợp cho khu vực pantry văn phòng, pha cà phê nhanh chóng.',
      type: 'Electronics',
    },
    {
      assetID: 15,
      name: 'Máy quét HP ScanJet Pro',
      price: 4500000,
      description:
        'Máy quét tốc độ cao, hỗ trợ khổ giấy A4, tích hợp phần mềm OCR.',
      type: 'Office Equipment',
    },
    {
      assetID: 1,
      name: 'Laptop Dell XPS 13',
      price: 25000000,
      description:
        'Laptop mỏng nhẹ, hiệu suất cao, phù hợp cho lập trình viên.',
      type: 'Electronics',
    },
    {
      assetID: 2,
      name: 'Máy in Canon LBP 2900',
      price: 3000000,
      description: 'Máy in laser đơn sắc, tốc độ cao, độ bền ổn định.',
      type: 'Office Equipment',
    },
    {
      assetID: 3,
      name: 'Bàn làm việc gỗ sồi',
      price: 2000000,
      description: 'Bàn làm việc chân sắt mặt gỗ, kích thước 120x60 cm.',
      type: 'Furniture',
    },
    {
      assetID: 4,
      name: 'Điện thoại iPhone 14 Pro',
      price: 28000000,
      description:
        'Điện thoại thông minh cao cấp, màn hình OLED, camera chất lượng.',
      type: 'Electronics',
    },
    {
      assetID: 5,
      name: 'Ghế xoay văn phòng',
      price: 900000,
      description: 'Ghế lưới ngả lưng, có bánh xe và tay vịn điều chỉnh được.',
      type: 'Furniture',
    },
  ];

  dataSource: MatTableDataSource<Asset> = new MatTableDataSource(this.assets);

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
