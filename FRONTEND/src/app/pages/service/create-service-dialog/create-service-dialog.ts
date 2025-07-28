import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-create-service-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './create-service-dialog.html',
  styleUrls: ['./create-service-dialog.css']
})
export class CreateServiceDialog {
  serviceForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateServiceDialog>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      unit: ['', Validators.required],
      customerPrice: [0, [Validators.required, Validators.min(0.01)]],
      initialPrice: [0, [Validators.required, Validators.min(0.01)]],
      isTiered: [false],
      serviceTier: this.fb.array([], { validators: [this.tiersOverlapValidator()] })
    });
    this.onTieredToggle();
  }

  get tiers(): FormArray {
    return this.serviceForm.get('serviceTier') as FormArray;
  }

  addTier() {
    const tierGroup = this.fb.group({
      fromQuantity: [0, [Validators.required, Validators.min(0)]],
      toQuantity: [0, [Validators.required]],
      govUnitPrice: [0, [Validators.required, Validators.min(0.01)]]
    }, { validators: [this.quantityRangeValidator()] });

    this.tiers.push(tierGroup);

    this.tiers.updateValueAndValidity();
    this.serviceForm.updateValueAndValidity(); // <-- Thêm dòng này
  }
  onTieredToggle() {
    const isTiered = this.serviceForm.get('isTiered')?.value;

    if (isTiered) {
      this.serviceForm.get('initialPrice')?.clearValidators();
      this.serviceForm.get('initialPrice')?.updateValueAndValidity();

      this.serviceForm.get('serviceTier')?.setValidators([this.tiersOverlapValidator(), Validators.required]);
      this.serviceForm.get('serviceTier')?.updateValueAndValidity();
    } else {
      this.serviceForm.get('initialPrice')?.setValidators([Validators.required, Validators.min(0.01)]);
      this.serviceForm.get('initialPrice')?.updateValueAndValidity();

      this.serviceForm.get('serviceTier')?.clearValidators();
      this.serviceForm.get('serviceTier')?.updateValueAndValidity();
    }

    this.serviceForm.updateValueAndValidity();
  }


  removeTier(index: number) {
    this.tiers.removeAt(index);
    this.tiers.updateValueAndValidity();
  }

  quantityRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const from = group.get('fromQuantity')?.value;
      const to = group.get('toQuantity')?.value;
      if (to != null && from != null && to <= from) {
        return { invalidRange: true };
      }
      return null;
    };
  }

  tiersOverlapValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const tiers = control.value;
      if (!tiers || tiers.length < 2) return null;

      const sorted = [...tiers].sort((a: any, b: any) => a.fromQuantity - b.fromQuantity);

      for (let i = 0; i < sorted.length - 1; i++) {
        const currentTo = sorted[i].toQuantity;
        const nextFrom = sorted[i + 1].fromQuantity;
        if (nextFrom < currentTo) {
          return { overlap: true };
        }
      }

      return null;
    };
  }

  save() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }
    this.dialogRef.close(this.serviceForm.value);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
