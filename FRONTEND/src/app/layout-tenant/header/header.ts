import { ProfileService } from './../../services/profileservice';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SendNotification } from '../../pages/sendrequest/sendnotification';
import { Observable } from 'rxjs';
import { TenantModel } from '../../models/Tenant.model';
import { Profile } from '../../pages/profile/profile';
import { ProfileTenant } from '../../pages-tenant/profile-tenant/profile-tenant';

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
    private dialogSendRequest: MatDialog,
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

  openNotificationPopup(): void {
    const dialogRef = this.dialogSendRequest.open(SendNotification, {
      width: '50%',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Kết quả từ popup:', result);
        this.lastNotification = result;
        this.showSuccessMessage();
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
