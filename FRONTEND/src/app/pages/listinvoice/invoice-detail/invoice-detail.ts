import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-invoice-detail',
  imports: [CommonModule, MatDialogModule, MatIcon],
  templateUrl: './invoice-detail.html',
  styleUrl: './invoice-detail.css'
})
export class InvoiceDetail {
  constructor(
    public dialogRef: MatDialogRef<InvoiceDetail>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
  edit() {
  // emit event or handle update logic here
    this.dialogRef.close({ action: 'edit', invoice: this.data });
  }

  delete() {
    if (confirm('Are you sure to delete this invoice?')) {
      this.dialogRef.close({ action: 'delete', invoice: this.data });
    }
  }

}
