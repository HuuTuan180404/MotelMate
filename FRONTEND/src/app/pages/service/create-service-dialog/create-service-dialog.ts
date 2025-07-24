import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-service-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './create-service-dialog.html',
  styleUrl: './create-service-dialog.css'
})
export class CreateServiceDialog {
  newService = {
    name: '',
    unit: '',
    customerPrice: 0,
    initialPrice: 0,
    isTiered: false,
    serviceTier: [] as any[]
  };

  constructor(public dialogRef: MatDialogRef<CreateServiceDialog>) {}

  addTier() {
    this.newService.serviceTier.push({ fromQuantity: 0, toQuantity: 0, govUnitPrice: 0 });
  }

  removeTier(index: number) {
    this.newService.serviceTier.splice(index, 1);
  }

  save() {
    this.dialogRef.close(this.newService);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
