import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification-service';
import { ReadNotificationDTO } from '../../models/Notification.model';

// export interface Notification {
//   notiID: number;
//   title: string;
//   content: string;
//   createAt: Date;
//   isRead: boolean;
// }

// export interface ReadNotificationDTO {
//   notiID: number;
//   title: string;
//   content: string;
//   createAt: Date;
//   isRead: boolean;
// }

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {
  // notifications!: ReadNotificationDTO[];
  notifications: ReadNotificationDTO[] = [];

  constructor(
    public dialogRef: MatDialogRef<Notifications>,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.notificationService.tenantGetNotification().subscribe({
      next: (data) => {
        this.notifications = data.sort(
          (a: any, b: any) => b.createAt.getTime() - a.createAt.getTime()
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnInit(): void {}

  formatDateTime(date: Date | string): string {
    const d = new Date(date); // chuyển về Date object

    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  formatTimeAgo(date: Date | string): string {
    const parsedDate = new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - parsedDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;

    return this.formatDateTime(parsedDate);
  }

  markAsRead(notification: ReadNotificationDTO): void {
    notification.isRead = true;

    
  }

  markAllAsRead(): void {
    this.notifications.forEach((notification) => {
      notification.isRead = true;
    });
  }

  deleteNotification(notificationId: number): void {
    this.notifications = this.notifications.filter(
      (n) => n.notiID !== notificationId
    );
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
