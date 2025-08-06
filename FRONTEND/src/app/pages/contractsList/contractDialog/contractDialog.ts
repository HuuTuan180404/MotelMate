import {
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  signal,
} from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
export interface ContractFormData {
  buildingID: number;
  room: string;
  start: Date;
  end: Date;
  deposit: number;
  total: number;
  cccd: string;
  status?: 'Active' | 'Expire' | 'Terminate' | 'Unsigned';
}
export interface CreateContractDTO {
  buildingID: number;
  roomNumber: string;
  startDate: string;
  endDate: string;
  deposit: number;
  price: number;
  cccd: string;
}
export interface Building {
  buildingID: number;
  name: string;
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
  formData: ContractFormData = {
    buildingID: -1,
    room: '',
    start: new Date(),
    end: new Date(),
    deposit: -1,
    total: -1,
    cccd: '',
    status: 'Unsigned',
  };
  buildings: Building[] = [];
  statuses: string[] = [];

  readonly errorMessage = signal('');
  private contractService = inject(ContractService);
  private apiUrl = `${environment.apiUrl}`;

  roomCtrl = new FormControl<string | null>(null, [Validators.required]);
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
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {
    this.http
      .get<{ name: string; buildingID: number }[]>(
        `${this.apiUrl}/api/Building`
      )
      .subscribe((response) => {
        this.buildings = response.map((b) => ({
          buildingID: b.buildingID,
          name: b.name,
        }));
        this.cdr.detectChanges();
      });

    this.http
      .get<any[]>(`${this.apiUrl}/api/Enum/contract-statuses`)
      .subscribe((response) => {
        this.statuses = response.map((item) => item.name);
        this.cdr.detectChanges();
      });
  }

  ngAfterViewInit() {
    if (this.data) {
      this.formData.buildingID = this.data.buildingID;
      this.roomCtrl.setValue(this.data.roomNumber);
      this.depositCtrl.setValue(this.data.deposit);
      this.totalCtrl.setValue(this.data.total);
      this.cdr.detectChanges();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.formData.room = this.roomCtrl.value!;
    this.formData.start = this.startCtrl.value!;
    this.formData.end = this.endCtrl.value!;
    this.formData.deposit = this.depositCtrl.value!;
    this.formData.total = this.totalCtrl.value!;
    this.formData.cccd = this.cccdCtrl.value!;

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
      buildingID: this.formData.buildingID,
      roomNumber: this.formData.room,
      startDate: this.formData.start.toISOString().split('T')[0],
      endDate: this.formData.end.toISOString().split('T')[0],
      deposit: this.formData.deposit,
      price: this.formData.total,
      cccd: this.formData.cccd,
    };

    this.contractService.createContract(createDTO).subscribe(
      (response) => {
        this._snackBar.open('Contract created successfully', 'Close', {
          duration: 4000,
          panelClass: ['snackbar-success'],
          verticalPosition: 'top',
        });
        this.dialogRef.close(this.formData);
      },
      (error) => {
        this._snackBar.open(
          'Failed to create contract: ' +
            (error.error.message || 'Unknown error'),
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
