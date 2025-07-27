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
  totalInitialPrice = 0;
  totalCustomerPrice = 0;

  ngOnInit() {
  if (this.data.services?.length) {
    this.totalInitialPrice = this.data.services.reduce((sum: number, s: { initialPrice: number }) => sum + s.initialPrice, 0);
    this.totalCustomerPrice = this.data.services.reduce((sum: number, s: { customerPrice: number }) => sum + s.customerPrice, 0);
  }
}


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
  getTotalInitialPrice(services: any[]) {
  return services.reduce((sum, s) => sum + s.initialPrice, 0);
}


}
