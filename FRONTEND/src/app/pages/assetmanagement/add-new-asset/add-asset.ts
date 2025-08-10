import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialog,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatSelectModule } from '@angular/material/select';
import { AssetModel } from '../../../models/Asset.model';
import { AssetService } from '../../../services/asset-service';
import { EnumModel } from '../../../models/Enum.model';
import { DialogAction, ReusableDialog } from '../../dialog/dialog';

export interface AssetType {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-asset',
  imports: [
    ReactiveFormsModule,
    MatOptionModule,
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatError,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './add-asset.html',
  styleUrls: ['./add-asset.css'],
})
export class AssetDialogComponent {
  assetForm: FormGroup;

  _assetTypes: EnumModel[] = [];
  title = 'Create New';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AssetDialogComponent>,
    private dialog: MatDialog,
    private assetService: AssetService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: AssetModel
  ) {
    if (data) {
      this.title = 'Edit';
    }

    this.assetForm = this.fb.group({
      type: [data?.type || '', Validators.required],
      name: [data?.name || '', [Validators.required, Validators.minLength(2)]],
      price: [data?.price || '', [Validators.required, Validators.min(0)]],
      description: [data?.description || '', Validators.maxLength(500)],
    });
  }

  ngOnInit() {
    this.loadAssetTypes();
  }

  loadAssetTypes() {
    this.assetService.getAddAssetTypes().subscribe((assetTypes) => {
      this._assetTypes = assetTypes;
      this.cdr.detectChanges();
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.assetForm.valid) {
      const formValue = this.assetForm.value;
      const asset: AssetModel = {
        ...this.data,
        type: formValue.type,
        name: formValue.name,
        price: parseFloat(formValue.price),
        description: formValue.description,
      };

      // if (this.data) {
      this.assetService.createAsset(asset).subscribe({
        next: (re: any) => {
          asset.assetID = re.assetID;
          this.dialogRef.close(asset);

          const actions: DialogAction[] = [
            {
              label: 'Ok',
              bgColor: 'primary',
              callback: () => {
                return true;
              },
            },
          ];

          const dialogResult = this.dialog.open(ReusableDialog, {
            data: {
              icon: 'check_circle',
              title: 'Successfully!',
              message: re.message,
              actions: actions,
            },
          });

          dialogResult.afterClosed().subscribe((result) => {
            this.dialogRef.close(asset);
          });
        },
        error: (err) => {
          console.error('Lỗi khi tạo tài sản:', err);
        },
        complete: () => {},
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.assetForm.controls).forEach((key) => {
      const control = this.assetForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.assetForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} là bắt buộc`;
    }
    if (control?.hasError('minlength')) {
      return `${this.getFieldDisplayName(fieldName)} phải có ít nhất 2 ký tự`;
    }
    if (control?.hasError('min')) {
      return 'Giá phải lớn hơn hoặc bằng 0';
    }
    if (control?.hasError('maxlength')) {
      return 'Mô tả không được vượt quá 500 ký tự';
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      type: 'Loại tài sản',
      name: 'Tên tài sản',
      price: 'Giá',
      description: 'Mô tả',
    };
    return fieldNames[fieldName] || fieldName;
  }
}
