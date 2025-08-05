import { ProfileService } from './../../services/profileservice';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SendNotification } from '../../pages/send-notification/sendnotification';
import { Observable } from 'rxjs';
import { TenantModel } from '../../models/Tenant.model';
import { Profile } from '../../pages/profile/profile';
import { SendRequest } from '../../pages-tenant/send-request/send-request';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  lastNotification: any = null;
  profileImage = '../../assets/images/avatar_error.png';
  profileName = '';
  constructor(
    private dialogSendMessage: MatDialog,
    private dialogProfile: MatDialog,
    private profileService: ProfileService
  ) {}
  ngOnInit(): void {
    this.refreshProfile();
  }
  sendMessage() {
    this.openNotificationPopup();
  }

  openProfileDialog(): void {
    const dialogRef = this.dialogProfile.open(Profile, {
      width: '60%',
      maxWidth: '60rem',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshProfile();
    });
  }

  openNotificationPopup(): void {
    const dialogRef = this.dialogSendMessage.open(SendRequest, {
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
}
