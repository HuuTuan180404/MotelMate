import { Component, inject, Inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ContractService } from '../../../services/contractservice';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
export interface ContractFormData {
  building: string;
  room: number;
  start: Date;
  end: Date;
  deposit: number;
  total: number;
  cccd: string;
  status?: 'Active' | 'Expire' | 'Terminate' | 'Unsigned';
}
export interface CreateContractDTO {
  buildingName: string;
  roomNumber: number;
  startDate: string;
  endDate: string;
  deposit: number;
  price: number;
  cccd: string;
}

@Component({
  selector: 'contract-dialog',
  templateUrl: './contractDialog.html',
  styleUrls: ['./contractDialog.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
  ],
})
export class AddContractDialogComponent {
  private _snackBar = inject(MatSnackBar);
  formData: ContractFormData;
  buildings: string[] = [];
  contracts: any[] = [];
  statuses: string[] = [];
  readonly errorMessage = signal('');
  private contractService = inject(ContractService);

  roomCtrl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(1),
  ]);
  startCtrl = new FormControl<Date | null>(null, Validators.required);
  endCtrl = new FormControl<Date | null>(null, Validators.required);
  depositCtrl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0),
  ]);
  totalCtrl = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0),
  ]);
  cccdCtrl = new FormControl<string | null>(null, [
    Validators.required,
    Validators.pattern(/^\d{9,12}$/),
  ]);

  constructor(
    public dialogRef: MatDialogRef<AddContractDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.formData = { ...data.formData };
    this.buildings = data.buildings || [];
    this.contracts = data.contracts || [];
    this.statuses = data.statuses || [];

    this.roomCtrl.setValue(this.formData.room ?? null);
    this.startCtrl.setValue(new Date(this.formData.start));
    this.endCtrl.setValue(new Date(this.formData.end));
    this.depositCtrl.setValue(this.formData.deposit);
    this.totalCtrl.setValue(this.formData.total);
    this.cccdCtrl.setValue(this.formData.cccd);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  updateErrorMessage(): void {
    const room = this.roomCtrl.value;
    if (!room || room < 1) {
      this.errorMessage.set('Please enter a valid room number!');
      this.roomCtrl.setErrors({ invalid: true });
      return;
    }

    const exists = this.contracts.some(
      (c) => c.building === this.formData.building && c.room === room
    );

    if (exists) {
      this.errorMessage.set('This room already has a contract!');
      // this.roomCtrl.setErrors({ conflict: true });
      return;
    } else {
      this.errorMessage.set('');
      this.roomCtrl.setErrors(null);
    }
  }

  onConfirm(): void {
    this.formData.room = this.roomCtrl.value ?? 0;
    this.formData.start = this.startCtrl.value!;
    this.formData.end = this.endCtrl.value!;
    this.formData.deposit = this.depositCtrl.value!;
    this.formData.total = this.totalCtrl.value!;
    this.formData.cccd = this.cccdCtrl.value!;

    this.updateErrorMessage();

    if (
      this.roomCtrl.invalid ||
      this.startCtrl.invalid ||
      this.endCtrl.invalid ||
      this.depositCtrl.invalid ||
      this.totalCtrl.invalid ||
      this.cccdCtrl.invalid
    )
      return;
    const createDTO: CreateContractDTO = {
      buildingName: this.formData.building,
      roomNumber: this.formData.room,
      startDate: this.formData.start.toISOString().split('T')[0],
      endDate: this.formData.end.toISOString().split('T')[0],
      deposit: this.formData.deposit,
      price: this.formData.total,
      cccd: this.formData.cccd,
    };
    this.contractService.createContract(createDTO).subscribe(
      (response) => {
        this.dialogRef.close(this.formData);
      },
      (error) => {
        console.error(error);
        this._snackBar.open(
          'Failed to create contract: ' + (error.error.message || 'Unknown error'),
          'Close',
          {
            duration: 4000,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top',
          }
        );
      }
    );
  }

  clearRoomError(): void {
    this.errorMessage.set('');
  }
}
