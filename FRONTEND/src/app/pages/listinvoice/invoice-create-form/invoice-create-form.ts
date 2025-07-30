import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice-create-form',
  standalone: true, 
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './invoice-create-form.html',
  styleUrl: './invoice-create-form.css'
})
export class InvoiceCreateForm {
  invoiceForm: FormGroup;
  total: number = 0;

  constructor(
    public dialogRef: MatDialogRef<InvoiceCreateForm>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.invoiceForm = this.fb.group({
      building: ['', Validators.required],
      room: ['', Validators.required],
      month: ['', Validators.required],
      due: ['', Validators.required],
      electric: [0],
      water: [0]
    });
  }

  calculateTotal() {
    const electric = this.invoiceForm.get('electric')?.value || 0;
    const water = this.invoiceForm.get('water')?.value || 0;
    this.total = electric * 3000 + water * 5000; // Example calculation
    this.cdr.detectChanges();
  }

  save() {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }
    this.dialogRef.close(this.invoiceForm.value);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
