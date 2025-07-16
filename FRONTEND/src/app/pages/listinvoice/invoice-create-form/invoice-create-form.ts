import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-invoice-create-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './invoice-create-form.html',
  styleUrl: './invoice-create-form.css'
})
export class InvoiceCreateForm {
  electric = 0;
  water = 0;

  constructor(
    public dialogRef: MatDialogRef<InvoiceCreateForm>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  calculateTotal() {
    this.data.total = (this.electric * 3500) + (this.water * 20000);
  }
}
