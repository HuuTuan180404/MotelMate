import { ChangeDetectorRef, Component, Inject, Input } from '@angular/core';
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
import { TenantModel } from '../../models/Tenant.model';
import { TenantService } from '../../services/tenantservice';

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
  _tenantDetail?: TenantModel;

  constructor(
    private dialogRef: MatDialogRef<TenantDetail>,
    private tenantService: TenantService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private tenantID: number // @Inject(MAT_DIALOG_DATA) private tenantDetail: TenantModel
  ) {
    this.getTenantInfomation(this.tenantID);
  }

  getTenantInfomation(id: number) {
    this.tenantService.getTenantDetail(this.tenantID).subscribe((data) => {
      this._tenantDetail = data;
      this._tenantDetail?.contractDetails.sort(
        (a: any, b: any) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      this.cdr.detectChanges();
    });
  }

  calculateDuration(
    startDate: string,
    moveOut: string | undefined | null
  ): string {
    const moveIn = new Date(startDate);
    const endDate = moveOut ? new Date(moveOut) : new Date();
    const diffTime = Math.abs(endDate.getTime() - moveIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;

    if (months > 0) {
      return `${months} tháng ${days} ngày`;
    }
    return `${days} ngày`;
  }

  onClickDone() {
    this.dialogRef.close();
  }
}
