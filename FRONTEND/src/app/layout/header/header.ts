import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SendNotification } from '../../pages/sendrequest/sendnotification';
import { Observable } from 'rxjs';
import { TenantModel } from '../../models/Tenant.model';
import { Profile } from '../../pages/profile/profile';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  lastNotification: any = null;

  constructor(private dialogSendRequest: MatDialog, private dialogProfile: MatDialog) {}
  sendMessage() {
    this.openNotificationPopup();
  }
  openProfileDialog(): void {
    this.dialogProfile.open(Profile, {
      width: '60%',
      maxWidth: '60rem',
      maxHeight: '90vh',
      panelClass: 'custom-dialog'
    });
  }
  openNotificationPopup(): void {
    console.log('Mở popup gửi thông báo');

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
      } else {
        console.log('Người dùng đã hủy');
      }
    });
  }

  showSuccessMessage(): void {
    console.log('Hiển thị thông báo thành công');
    alert('Gửi thông báo thành công!');
  }
}
