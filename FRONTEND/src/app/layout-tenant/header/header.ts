import { ProfileService } from './../../services/profileservice';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SendNotification } from '../../pages/send-notification/sendnotification';
import { Observable } from 'rxjs';
import { TenantModel } from '../../models/Tenant.model';
import { Profile } from '../../pages/profile/profile';
import { ProfileTenant } from '../../pages-tenant/profile-tenant/profile-tenant';
import { SendRequest } from '../../pages-tenant/send-request/send-request';
import { Notifications } from '../../pages-tenant/notifications/notifications';
import { NotificationService } from '../../services/notification-service';
import { CommonModule } from '@angular/common';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  lastNotification: any = null;
  profileImage = '../../assets/images/avatar_error.png';
  profileName = '';
  _hasNewNotification: boolean = true;
  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private dialogProfile: MatDialog,
    private profileService: ProfileService,
    private notificationService: NotificationService
  ) {}
  ngOnInit(): void {
    this.refreshProfile();

    this.notificationService.hasNewNotification$.subscribe((hasNew) => {
      this._hasNewNotification = hasNew;
      this.cdr.detectChanges();
    });

    this.notificationService.startConnection();
  }

  private checkInitialNotificationState() {
    this.notificationService.checkNewNotification().subscribe((hasNew) => {
      this._hasNewNotification = hasNew;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.notificationService.stopConnection();
  }

  openProfileDialog(): void {
    const dialogRef = this.dialogProfile.open(ProfileTenant, {
      width: '60%',
      maxWidth: '60rem',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshProfile();
    });
  }

  openSendRequestDialog(): void {
    const dialogRef = this.dialog.open(SendRequest, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result: object) => {
      if (result) {
        console.log(result);
      }
    });
  }

  refreshProfile() {
    this.profileService.getProfile().subscribe((data) => {
      this.profileImage =
        data.urlAvatar || '../../assets/images/avatar_error.png';
      this.profileName = data.fullName;
    });
  }

  showSuccessMessage(): void {
    alert('Gửi thông báo thành công!');
  }

  openNotificationDialog(): void {
    this.notificationService.tenantGetNotification().subscribe({
      next: (data) => {
        this._hasNewNotification = data.some((item) => item.isRead === false);
        this.cdr.detectChanges();

        const dialogRef = this.dialog.open(Notifications, {
          width: '600px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          disableClose: false,
          autoFocus: false,
          data: data.sort(
            (a: any, b: any) =>
              new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
          ),
        });

        dialogRef.componentInstance.dataEmitter.subscribe((result: boolean) => {
          if (result) {
            this._hasNewNotification = false;
          } else {
            this._hasNewNotification = data.some(
              (item) => item.isRead === false
            );
          }
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
