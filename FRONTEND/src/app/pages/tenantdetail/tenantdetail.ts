import { Component, Inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tenantdetail',
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule,
  ],
  templateUrl: './tenantdetail.html',
  styleUrl: './tenantdetail.css',
})
export class TenantDetail {
  tenant: any = {
    id: '1',
    avatar: '/assets/images/avatar-placeholder.jpg',
    cccd: '123456789012',
    fullName: 'Nguyễn Văn An',
    bDate: new Date('1990-05-15'),
    rentalHistory: [
      {
        contractCode: 'HD001',
        checkInDate: new Date('2023-01-15'),
        checkOutDate: new Date('2023-12-31'),
        roomNumber: 'P101',
        status: 'completed',
        monthlyRent: 3500000,
      },
      {
        contractCode: 'HD002',
        checkInDate: new Date('2024-01-01'),
        checkOutDate: null,
        roomNumber: 'P205',
        status: 'active',
        monthlyRent: 4200000,
      },
      {
        contractCode: 'HD003',
        checkInDate: new Date('2022-06-01'),
        checkOutDate: new Date('2022-12-31'),
        roomNumber: 'P103',
        status: 'completed',
        monthlyRent: 3200000,
      },
    ],
  };

  constructor() {}

  ngOnInit(): void {
    // Sắp xếp lịch sử theo thời gian mới nhất
    this.tenant.rentalHistory.sort(
      (a: any, b: any) =>
        new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
    );
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN').format(date);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  calculateDuration(checkIn: Date, checkOut: Date | null): string {
    const endDate = checkOut || new Date();
    const diffTime = Math.abs(endDate.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;

    if (months > 0) {
      return `${months} tháng ${days} ngày`;
    }
    return `${days} ngày`;
  }
}
