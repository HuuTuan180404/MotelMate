import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ConfirmDialog } from '../../service/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceService } from '../../../services/invoice-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UpdateInvoice, UpdateExtraCost, UpdateInvoiceDetail } from '../../../models/Invoice.model';
import { Payment } from '../payment/payment';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIcon,
    MatSnackBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './invoice-detail.html',
  styleUrl: './invoice-detail.css'
})
export class InvoiceDetail {
  editing = false;
  originalData: any;
  statuses = ['Paid', 'Unpaid', 'Overdue'];
  role: string = '';

  constructor(
    public dialogRef: MatDialogRef<InvoiceDetail>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.role = this.data.role;
    this.originalData = JSON.parse(JSON.stringify(this.data));
  }

  close(): void {
    this.dialogRef.close();
  }

  startEdit() {
    if (this.role !== 'owner') return;
    this.editing = true;
  }

  cancelEdit() {
    this.data = JSON.parse(JSON.stringify(this.originalData));
    this.editing = false;
  }

  save() {
    const updateData: UpdateInvoice = {
      dueDate: this.data.due,
      status: this.data.status,
      extraCosts: this.data.extraCosts.map((e: any) => ({
        extraCostID: e.extraCostID,
        description: e.description,
        amount: e.amount
      })) as UpdateExtraCost[],
      invoiceDetails: this.data.services.map((s: any) => ({
        serviceID: s.serviceID,
        quantity: s.quantity
      })) as UpdateInvoiceDetail[]
    };
    console.log('Update Invoice Payload:', updateData); // <== LOG NÀY
    this.invoiceService.updateInvoice(this.data.invoiceID, updateData).subscribe({
      next: () => {
        this.snackBar.open('Invoice updated successfully.', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: 'custom-snackbar-success'
        });
        this.originalData = JSON.parse(JSON.stringify(this.data));
        this.editing = false;
      },
      error: (err) => {
        console.error('Failed to update invoice', err);
        this.snackBar.open('Failed to update invoice.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: 'custom-snackbar'
        });
      }
    });
  }

  delete() {
    if (this.role !== 'owner') return;

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

  onDueDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + selectedDate.getDate()).slice(-2);
      this.data.due = `${year}-${month}-${day}`;
    }
  }

  payInvoice() {
    const dialogRef = this.dialog.open(Payment, {
      width: '400px',
      data: {
        invoiceID: this.data.invoiceID,
        invoiceCode: this.data.invoiceCode,
        total: this.data.total
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.paid) {
        // Call API update status -> 'Paid' here
        this.data.status = 'Paid';
      }
    });
  }


}
