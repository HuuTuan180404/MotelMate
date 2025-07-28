import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ConfirmDialog } from '../../service/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceService } from '../../../services/invoice-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIcon, MatSnackBarModule],
  templateUrl: './invoice-detail.html',
  styleUrl: './invoice-detail.css'
})
export class InvoiceDetail {
  constructor(
    public dialogRef: MatDialogRef<InvoiceDetail>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar
  ) {}

  totalInitialPrice = 0;
  totalCustomerPrice = 0;

  ngOnInit() {}

  close(): void {
    this.dialogRef.close();
  }

  edit() {
    this.dialogRef.close({ action: 'edit', invoice: this.data });
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this invoice?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.invoiceService.deleteInvoice(this.data.invoiceID).subscribe({
          next: () => {
            this.snackBar.open('Invoice deleted successfully.', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar-success'
            });
            this.dialogRef.close({ action: 'delete', invoiceID: this.data.invoiceID });
          },
          error: (err) => {
            console.error('Failed to delete invoice', err);
            this.snackBar.open('Failed to delete invoice.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar'
            });
          }
        });
      }
    });
  }

  getTotalInitialPrice(services: any[]) {
    return services.reduce((sum, s) => sum + s.initialPrice, 0);
  }
}
