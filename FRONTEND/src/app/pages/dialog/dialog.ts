import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
// import { DialogAction } from './dialog-action.model';
export interface DialogAction {
  label: string;
  bgColor?: 'primary' | 'warn' | 'accent';
  callback: () => void;
}
@Component({
  selector: 'app-reusable-dialog',
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatIconModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class ReusableDialog {
  constructor(
    public dialogRef: MatDialogRef<ReusableDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      icon: string;
      title: string;
      message: string;
      actions: DialogAction[];
    }
  ) {}

  onAction(action: DialogAction) {
    this.dialogRef.close(action.callback());
  }
}
