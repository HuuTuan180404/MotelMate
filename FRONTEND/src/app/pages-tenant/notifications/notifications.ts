import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface Notification {
  id: number;
  title: string;
  content: string;
  sentDate: Date;
  isRead: boolean;
}

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {
  notifications: Notification[] = [
    {
      id: 1,
      title: 'Thông báo thanh toán tiền phòng',
      content:
        'Phòng #101 cần thanh toán tiền thuê tháng 8/2025. Hạn thanh toán: 05/08/2025. Vui lòng liên hệ chủ nhà để được hướng dẫn chi tiết.',
      sentDate: new Date('2025-08-01T09:30:00'),
      isRead: false,
    },
    {
      id: 2,
      title: 'Bảo trì hệ thống điện',
      content:
        'Tòa nhà sẽ tiến hành bảo trì hệ thống điện vào ngày 10/08/2025 từ 8:00 - 12:00. Trong thời gian này sẽ cắt điện tạm thời.',
      sentDate: new Date('2025-08-02T14:15:00'),
      isRead: false,
    },
    {
      id: 3,
      title: 'Quy định mới về giờ giấc',
      content:
        'Từ ngày 15/08/2025, tòa nhà áp dụng quy định mới: Giờ yên lặng từ 22:00 - 06:00. Mọi người vui lòng tuân thủ để đảm bảo môi trường sống tốt.',
      sentDate: new Date('2025-08-03T16:45:00'),
      isRead: true,
    },
    {
      id: 4,
      title: 'Thông báo tìm người ở ghép',
      content:
        'Phòng #205 hiện có 1 chỗ trống, cần tìm thêm 1 người ở ghép. Giá thuê: 1,750,000 VNĐ/tháng. Liên hệ: 0901234567.',
      sentDate: new Date('2025-08-04T11:20:00'),
      isRead: true,
    },
    {
      id: 5,
      title: 'Sự kiện giao lưu cư dân',
      content:
        'Tòa nhà tổ chức buổi giao lưu cư dân vào Chủ nhật 10/08/2025 lúc 19:00 tại sảnh tầng trệt. Có nhiều hoạt động thú vị và quà tặng.',
      sentDate: new Date('2025-08-05T08:00:00'),
      isRead: false,
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<Notifications>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Sắp xếp thông báo theo thời gian mới nhất
    this.notifications.sort(
      (a, b) => b.sentDate.getTime() - a.sentDate.getTime()
    );
  }

  formatDateTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    return this.formatDateTime(date);
  }

  markAsRead(notification: Notification): void {
    notification.isRead = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach((notification) => {
      notification.isRead = true;
    });
  }

  deleteNotification(notificationId: number): void {
    this.notifications = this.notifications.filter(
      (n) => n.id !== notificationId
    );
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
