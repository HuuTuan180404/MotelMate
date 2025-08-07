import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { InvoiceService } from '../../../services/invoice-service';
import { OwnerBankInfo } from '../../../models/Invoice.model';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-payment',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    DecimalPipe
  ],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class Payment implements OnInit {
  qrUrl: string = '';
  selectedFile: File | null = null;
  previewURL: string | ArrayBuffer | null = null;
  imageURL: string = '';
  formSubmitted: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { invoiceID: number, invoiceCode: string, total: number },
    private dialogRef: MatDialogRef<Payment>,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.invoiceService.getOwnerBankInfo(this.data.invoiceID).subscribe({
      next: (bankInfo: OwnerBankInfo) => {
        const amount = this.data.total;
        const addInfo = encodeURIComponent(`Invoice ${this.data.invoiceCode}`);
        this.qrUrl = `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNo}-compact2.png?amount=${amount}&addInfo=${addInfo}`;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.snackBar.open('Failed to load bank info.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: 'custom-snackbar'
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  async onFileSelected(event: Event): Promise<void> {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewURL = reader.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);

      try {
        const imageUrl = await this.uploadImageToCloudinary(this.selectedFile);
        this.imageURL = imageUrl;
        this.snackBar.open('Image uploaded successfully.', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: 'custom-snackbar-success'
        });
      } catch (error) {
        console.error('Image upload failed', error);
        this.snackBar.open('Image upload failed.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: 'custom-snackbar'
        });
      }
    }
  }

  async uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  }

  confirmPayment(): void {
    this.formSubmitted = true;

    if (!this.imageURL) {
      this.snackBar.open('Please upload payment proof image.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: 'custom-snackbar'
      });
      return;
    }

    this.invoiceService.createPaymentRequest(this.data.invoiceID, this.imageURL).subscribe({
      next: () => {
        this.snackBar.open('Payment request sent successfully.', 'Close', {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: 'custom-snackbar-success'
        });
        this.dialogRef.close({ paid: false });
      },
      error: (err) => {
        const message = err.error?.message || 'Failed to send payment request.';
        this.snackBar.open(message, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: 'custom-snackbar'
        });
      }
    });
  }
}
