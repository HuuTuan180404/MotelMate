
import { Component, Inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

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
    ReactiveFormsModule,
    MatIconModule
  ],
})
export class AddContractDialogComponent {
  formData: ContractFormData;
  buildings: string[] = [];
  contracts: any[] = [];
  statuses: string[] = [];
  readonly errorMessage = signal('');
  roomCtrl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
  ]);


  constructor(
    public dialogRef: MatDialogRef<AddContractDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.formData = { ...data.formData };
    this.buildings = data.buildings || [];
    this.contracts = data.contracts || [];
    this.roomCtrl.setValue(this.formData.room ?? null);
    this.statuses = data.statuses || [];
  }

  ngOnInit(): void {

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  updateErrorMessage(): void {
  const room = this.roomCtrl.value;

  if (!room || room < 1) {
    this.errorMessage.set('Please enter a valid room number!');
    return;
  }


  const exists = this.contracts.some(
    c => c.building === this.formData.building && c.room === room
  );

  if (exists) {
    this.errorMessage.set('This room already has a contract!');
    this.roomCtrl.setErrors({ conflict: true });
    return;
  }else{
    this.errorMessage.set('');
    this.roomCtrl.setErrors(null);
  }
}
  onConfirm(): void {

  this.formData.room = this.roomCtrl.value ?? 0;
  this.updateErrorMessage();
  if (this.roomCtrl.invalid) return;
  this.dialogRef.close(this.formData);
}

  clearRoomError(): void {
    this.errorMessage.set('');
  }
}
