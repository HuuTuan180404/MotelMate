import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvoiceService } from '../../../services/invoice-service';
import { DecimalPipe } from '@angular/common';
import { OwnerBankInfo } from '../../../models/Invoice.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment {
  qrUrl: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<Payment>,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.invoiceService.getOwnerBankInfo(this.data.invoiceID).subscribe({
      next: (bankInfo: OwnerBankInfo) => {
        const amount = this.data.total;
        const addInfo = encodeURIComponent(`Invoice ${this.data.invoiceCode}`);
        this.qrUrl = `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNo}-compact2.png?amount=${amount}&addInfo=${addInfo}`;
        
        this.cdr.detectChanges();  // Trigger detectChanges to prevent ExpressionChangedAfterItHasBeenCheckedError
      },
      error: (err) => {
        this.snackBar.open('Failed to load bank info.', 'Close', { duration: 3000 });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  confirmPayment() {
    this.invoiceService.createPaymentRequest(this.data.invoiceID).subscribe({
      next: () => {
        this.snackBar.open('Payment request sent successfully.', 'Close', { duration: 3000 });
        this.dialogRef.close({ paid: false });
      },
      error: (err) => {
        this.snackBar.open(err.error, 'Close', { duration: 3000 });
      }
    });
  }
}
