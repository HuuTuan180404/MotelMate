// bắt trường hợp khi người xóa người cuối dùng ra danh sách = kết thúc hợp đồng, set lại trạng thía phòng
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RoomDetailModel } from '../../models/RoomDetail.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { TenantModel } from '../../models/Tenant.model';
import { TenantDetail } from '../tenantdetail/tenantdetail';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { RoomService } from '../../services/roomservice';
import { AddContractDialogComponent } from '../contractsList/contractDialog/contractDialog';
import { AssetModel } from '../../models/Asset.model';
import { AssetService } from '../../services/asset-service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { RoomImageModel, UpdateRoomDTO } from '../../models/Room.model';
import { TenantService } from '../../services/tenantservice';
import { DialogAction, ReusableDialog } from '../dialog/dialog';
import { ContractService } from '../../services/contractservice';
@Component({
  selector: 'app-roomdetail',
  imports: [
    MatChipsModule,
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTooltip,
    MatDialogModule,
    MatSliderModule,
  ],
  templateUrl: './roomdetail.html',
  styleUrl: './roomdetail.css',
})
export class RoomDetail {
  @ViewChild('scrollContainerThumbnails', { static: true })
  _scrollContainerThumbnails!: ElementRef;

  @ViewChild('inputAddMemberID')
  inputAddMemberID!: ElementRef<HTMLInputElement>;

  _roomDetail: RoomDetailModel = new RoomDetailModel();
  _assetsData: AssetModel[] = [];

  _selectedMember: number | null = null;
  _currentImage = '../../assets/images/avatar_error.png';

  _deletedImages: string[] = [];
  _addedImages: RoomImageModel[] = [];

  _deleteMembers: number[] = [];
  _addedMembers: number[] = [];

  // asset in DB
  _selectedAssets: {
    assetID: number;
    assetName: string;
    quantity: number;
  }[] = [];

  // asset is selected
  _checkedAssets: {
    assetID: number;
    assetName: string;
    quantity: number;
  }[] = [];

  selectedAssetsID = new FormControl<number[]>([]); // khởi tạo đúng kiểu dữ liệu

  constructor(
    @Inject(MAT_DIALOG_DATA) private roomID: number,
    private dialog: MatDialog,
    private roomService: RoomService,
    private tenantService: TenantService,
    private contractService: ContractService,
    private assetService: AssetService,
    public dialogRef: MatDialogRef<RoomDetail>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRoomData();
  }

  ngAfterViewInit() {
    const container = this._scrollContainerThumbnails?.nativeElement;
    if (!container) return;

    container.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        if (event.deltaY !== 0) {
          event.preventDefault();
          container.scrollLeft += event.deltaY;
        }
      },
      { passive: false }
    );
  }

  loadRoomData() {
    this.roomService.getRoomById(this.roomID).subscribe({
      next: (data) => {
        this._roomDetail = { ...data };
        this._selectedAssets = [...this._roomDetail.assetData];

        if (this._roomDetail.urlRoomImages?.length > 0) {
          this._currentImage = this._roomDetail.urlRoomImages[0];
        }

        const assetIDs = this._roomDetail.assetData.map((a: any) => a.assetID);
        setTimeout(() => {
          this.selectedAssetsID.setValue(assetIDs);
        }, 300);

        // Gọi loadAssets và truyền danh sách đã chọn vào
        this.loadAssets(this._selectedAssets);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading room detail:', error);
      },
    });
  }

  loadAssets(selectedAssets?: { assetID: number; quantity: number }[]) {
    this.assetService.getAllAssets().subscribe((data) => {
      this._assetsData = data.map(
        (x: any): AssetModel => ({
          assetID: x.assetID,
          name: x.name,
          price: x.price,
          type: x.type,
          description: x.description,
          quantity: x.quantity,
        })
      );

      // Khởi tạo _checkedAssets sau khi có _assetsData
      this._checkedAssets = this._assetsData.map((x) => {
        const selected = selectedAssets?.find((s) => s.assetID === x.assetID);
        return {
          assetID: x.assetID,
          assetName: x.name,
          quantity: selected ? selected.quantity : 0,
        };
      });

      this.cdr.detectChanges();
    });
  }

  defSelectedMember(id: number) {
    this._selectedMember = id;
  }

  get getAssetData(): {
    assetID: number;
    assetName: string;
    quantity: number;
  }[] {
    return this._checkedAssets.filter((x) => x.quantity > 0);
  }

  changeImage(image: any) {
    this._currentImage = image as string;
  }

  onAddMember(cccd: string) {
    console.log('Add member CCCD:', cccd);
    this.tenantService.getTenantDetailByCCCD(cccd).subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this._addedMembers.push(data.id);
          this._roomDetail.members.push(data);
          this.cdr.detectChanges();
        } else {
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
              icon: 'error',
              title: 'Error',
              message: 'User does not exist.',
              actions: actions,
            },
          });
        }
      },
      error: (error) => {
        console.log('Error loading tenant detail:', error);
      },
    });
  }

  onAddContract() {
    const dialogRef = this.dialog.open(AddContractDialogComponent, {
      height: 'auto',
      maxHeight: '90vh',
      minWidth: '50vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onViewMember(memberID: number) {
    this.dialog.open(TenantDetail, {
      height: 'auto',
      maxHeight: '90vh',
      minWidth: '60vw',
      data: memberID,
    });
  }

  onRemoveMember(memberID: number) {
    if (!this._roomDetail?.members || this._selectedMember === null) return;

    const index = this._roomDetail.members.findIndex(
      (item) => item.id === memberID
    );

    if (index > -1) {
      this._roomDetail.members.splice(index, 1);
    }

    const indexIn_addedMembers = this._addedMembers.findIndex(
      (item) => item === memberID
    );

    if (indexIn_addedMembers > -1) {
      this._addedMembers.splice(indexIn_addedMembers, 1);
    } else {
      this._deleteMembers.push(memberID);
    }
  }

  onOptionChange(event: MatOptionSelectionChange, assetID: number) {
    const state = event.source.selected;

    const val = this._checkedAssets.find((x) => x.assetID === assetID);

    if (val) {
      val.quantity = state ? 1 : 0;
    }

    this.cdr.detectChanges();
  }

  onSelectedAssetChangeQuantity(assetID: number, quan: number) {
    const val = this._checkedAssets.find((x) => x.assetID === assetID);

    if (val) {
      val.quantity += quan;

      if (val.quantity <= 0) {
        val.quantity = 0;

        const ids = this.selectedAssetsID.value || [];
        const updatedIDs = ids.filter((id) => id !== assetID);
        this.selectedAssetsID.setValue(updatedIDs);
      }

      this.cdr.detectChanges();
    }
  }

  onDeleteImage() {
    var index = this._roomDetail.urlRoomImages.indexOf(this._currentImage);

    // không tìm imgaes trong DB
    if (index <= -1) {
      index = this._addedImages.findIndex(
        (img) => img.url === this._currentImage
      );
      this._addedImages.splice(index, 1);
    } else {
      this._roomDetail.urlRoomImages.splice(index, 1);
      this._deletedImages.push(this._currentImage);
    }

    if (this._addedImages.length > 0) {
      this._currentImage = this._addedImages[0].url as string;
    } else {
      if (this._roomDetail.urlRoomImages.length > 0) {
        this._currentImage = this._roomDetail.urlRoomImages[0];
      } else {
        this._currentImage = '../../assets/images/avatar_error.png';
      }
    }
  }

  async onFileSelected(event: any): Promise<void> {
    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;

    const filePromises: Promise<void>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // if (!this.validateFile(file)) continue;
      if (this._addedImages.length >= 5) {
        console.warn(`Chỉ được tải tối đa 5 ảnh`);
        break;
      }

      const imageId = Math.random().toString(36).substr(2, 9);

      const filePromise = new Promise<void>((resolve) => {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const roomImage: RoomImageModel = {
            id: imageId,
            file: file,
            url: e.target.result,
            isThumb: false,
            name: file.name,
            size: file.size,
          };

          this._addedImages.push(roomImage);
          resolve();
        };

        reader.readAsDataURL(file);
      });

      filePromises.push(filePromise);
    }

    // Wait for all files to be processed
    await Promise.all(filePromises);

    // Force UI update
    this.cdr.detectChanges();

    // Reset input
    event.target.value = '';
  }

  onUploadImage(event: Event) {}

  onUpdateRoom() {
    // assets
    const writeAsset = this._checkedAssets.filter((x) => x.quantity > 0);
    for (let asset of this._roomDetail.assetData) {
      const val = writeAsset.find((x) => x.assetID === asset.assetID);
      if (!val) {
        writeAsset.push({ ...asset, quantity: 0 });
      }
    }

    const body: UpdateRoomDTO = {
      roomID: this._roomDetail.roomID,
      roomNumber: this._roomDetail.roomNumber,
      area: this._roomDetail.area,
      price: this._roomDetail.price,
      description: this._roomDetail.description,
      addedMembers: this._addedMembers,
      deletedMembers: this._deleteMembers,
      deletedImages: this._deletedImages,
      assets: writeAsset,
      terminateContract:
        this._roomDetail.members.length === 0 && this._deleteMembers.length > 0,
    };

    const formDataToSend = new FormData();
    // Ảnh: thêm mới
    this._addedImages.forEach((image) => {
      formDataToSend.append('addedImages', image.file, image.name);
    });

    formDataToSend.append('body', JSON.stringify(body));

    // gọi API update
    this.roomService.updateRoom(formDataToSend).subscribe({
      next: (data) => {
        alert(data.message);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  trackByAssetID(index: number, asset: AssetModel): number {
    return asset.assetID;
  }
}
