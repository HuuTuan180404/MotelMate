import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Building } from '../../../models/Building.model';
import { BuildingService } from '../../../services/building-service';
import { InvoiceDraftDto, BatchInvoiceDto } from '../../../models/Invoice.model';
import { InvoiceService } from '../../../services/invoice-service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const periodStart = control.get('periodStart')?.value;
  const periodEnd = control.get('periodEnd')?.value;
  const dueDate = control.get('dueDate')?.value;

  if (!periodStart || !periodEnd || !dueDate) return null;

  const start = new Date(periodStart);
  const end = new Date(periodEnd);
  const due = new Date(dueDate);

  const errors: any = {};

  if (end < start) {
    errors.periodEndBeforeStart = true;
  }

  if (due <= end) {
    errors.dueDateBeforeEnd = true;
  }

  return Object.keys(errors).length ? errors : null;
};

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
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,     // <== ADD
    MatCheckboxModule,  // <== ADD
    MatIconModule  
  ],
  templateUrl: './invoice-create-form.html',
  styleUrl: './invoice-create-form.css'
})


export class InvoiceCreateForm {
  invoiceForm: FormGroup;
  buildings: Building[] = [];
  drafts: any[] = [];
  displayedColumns: string[] = ['room', 'services', 'extra'];

  constructor(
    public dialogRef: MatDialogRef<InvoiceCreateForm>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private buildingService: BuildingService,
    private invoiceService: InvoiceService
  ) {
    this.invoiceForm = this.fb.group({
      buildingId: [null, Validators.required],
      periodStart: [null, Validators.required],
      periodEnd: [null, Validators.required],
      dueDate: [null, Validators.required]
    }, { validators: dateRangeValidator });

    this.loadBuildings();
  }

  loadBuildings() {
    this.buildingService.getBuildings().subscribe({
      next: (data) => this.buildings = data,
      error: (err) => console.error('Failed to load buildings', err)
    });
  }

  loadDrafts() {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const { buildingId, periodStart, periodEnd, dueDate } = this.invoiceForm.value;

    this.invoiceService.getInvoiceDrafts(
      buildingId,
      this.formatDate(periodStart),
      this.formatDate(periodEnd),
      this.formatDate(dueDate)
    ).subscribe({
      next: (data) => {
        this.drafts = data.map(d => ({
          ...d,
          services: d.services.map(s => ({ ...s, selected: false, quantity: 0 })),
          extraCosts: []
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load drafts', err)
    });
  }

  addExtraCost(draft: any) {
    const desc = prompt('Enter Extra Cost Description');
    const amountStr = prompt('Enter Extra Cost Amount');
    const amount = parseFloat(amountStr || '0');

    if (desc && !isNaN(amount)) {
      draft.extraCosts.push({ description: desc, amount });
    }
  }

  toggleServiceSelection(service: any) {
    // Nếu checkbox tick thì set quantity = 1
    if (service.selected && service.quantity <= 0) {
      service.quantity = 1;
    }
    // Nếu checkbox bỏ tick thì set quantity = 0
    if (!service.selected) {
      service.quantity = 0;
    }
  }

  isElectricOrWater(serviceName: string): boolean {
    return serviceName.toLowerCase().includes('điện') || serviceName.toLowerCase().includes('nước');
  }

  createBatch() {
    if (this.drafts.length === 0) return;

    const payload: BatchInvoiceDto[] = this.drafts.map(d => ({
      contractId: d.contractID,
      periodStart: this.formatDate(this.invoiceForm.value.periodStart),
      periodEnd: this.formatDate(this.invoiceForm.value.periodEnd),
      dueDate: this.formatDate(this.invoiceForm.value.dueDate),
      description: '',
      services: d.services
        .filter((s: any) => s.selected || s.quantity > 0)
        .map((s: any) => ({
          serviceId: s.serviceID,
          quantity: s.quantity > 0 ? s.quantity : 1 // Nếu tick checkbox thì default 1
        })),
      extraCosts: d.extraCosts
    }));

    this.invoiceService.batchCreateWithNotification(payload).subscribe({
      next: () => {
        alert('Batch Invoices Created Successfully!');
        this.dialogRef.close(true);
      },
      error: (err) => console.error('Failed to create batch invoices', err)
    });
  }

  onDateChange() {
    this.invoiceForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });

    const groupErrors = this.invoiceForm.errors || {};

    const periodEndControl = this.invoiceForm.get('periodEnd');
    const dueDateControl = this.invoiceForm.get('dueDate');
    const periodStartControl = this.invoiceForm.get('periodStart');

    // Period End validate (chỉ hiện khi đã touch Period End hoặc Period Start)
    if (groupErrors['periodEndBeforeStart'] && (periodEndControl?.touched || periodStartControl?.touched)) {
      periodEndControl?.setErrors({ periodEndBeforeStart: true });
    } else if (periodEndControl?.hasError('periodEndBeforeStart')) {
      periodEndControl.setErrors(null);
      periodEndControl.updateValueAndValidity({ onlySelf: true });
    }

    // Due Date validate (chỉ hiện khi đã touch Due Date hoặc Period End)
    if (groupErrors['dueDateBeforeEnd'] && (dueDateControl?.touched || periodEndControl?.touched)) {
      dueDateControl?.setErrors({ dueDateBeforeEnd: true });
    } else if (dueDateControl?.hasError('dueDateBeforeEnd')) {
      dueDateControl.setErrors(null);
      dueDateControl.updateValueAndValidity({ onlySelf: true });
    }
  }



  cancel() {
    this.dialogRef.close(null);
  }

  private formatDate(date: Date): string {
    if (!date) return '';

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`; // yyyy-MM-dd (Local date)
  }

}
