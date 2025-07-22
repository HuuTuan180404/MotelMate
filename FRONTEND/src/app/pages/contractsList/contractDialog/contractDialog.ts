
import { Component, Inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export interface ContractFormData {
  building: string;
  room: number;
  start: string;
  end: string;
  deposit: number;
  total: number;
  status: 'Active' | 'Expire' | 'Terminate' | 'Unsigned';
}

@Component({
  selector: 'contract-dialog',
  templateUrl: './contractDialog.html',
  styleUrls: ['./contractDialog.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class AddContractDialogComponent {
  formData: ContractFormData;
  buildings: string[] = [];
  contracts: any[] = [];
  errorMessage = signal('');

  constructor(
    public dialogRef: MatDialogRef<AddContractDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formData = { ...data.formData };
    this.buildings = data.buildings || [];
    this.contracts = data.contracts || [];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
  // Nếu chưa nhập số phòng hợp lệ, không submit
  if (!this.formData.room || this.formData.room < 1) {
    this.errorMessage.set('Vui lòng nhập số phòng hợp lệ.');
    return;
  }

  const exists = this.contracts.some(
    c => c.building === this.formData.building && c.room === this.formData.room
  );

  if (exists) {
    this.errorMessage.set('Phòng này đã có hợp đồng!');
    return;
  }

  this.dialogRef.close(this.formData);
}

  clearRoomError(): void {
    this.errorMessage.set('');
  }
}
