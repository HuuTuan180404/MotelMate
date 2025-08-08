import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification-service';
import { ReadNotificationDTO } from '../../models/Notification.model';
import { Subject } from 'rxjs';

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
export class Notifications {
  // notifications!: ReadNotificationDTO[];
  notifications: ReadNotificationDTO[] = [];
  dataEmitter = new Subject<boolean>();
  constructor(
    public dialogRef: MatDialogRef<Notifications>,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: ReadNotificationDTO[]
  ) {
    this.notifications = data;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

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
    if (!notification || notification.isRead) {
      return; // Không làm gì nếu null hoặc đã được đọc
    }

    this.notificationService
      .isReadNotification([notification.notiID])
      .subscribe({
        next: (data) => {
          notification.isRead = true;
          this.dataEmitter.next(false);
          this.cdr.detectChanges();
        },
        error: (err) => {
          alert(err.message);
        },
      });
  }

  markAllAsRead(): void {
    const unreadNotifications = this.notifications.filter((n) => !n.isRead);
    const notiIDs = unreadNotifications.map((n) => n.notiID);

    if (notiIDs.length === 0) {
      return;
    }

    this.notificationService.isReadNotification(notiIDs).subscribe({
      next: () => {
        unreadNotifications.forEach((n) => (n.isRead = true));
        this.dataEmitter.next(true);
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert(err?.error?.message || 'Lỗi khi đánh dấu tất cả là đã đọc');
      },
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
