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
import { RoomImageModel } from '../../models/Room.model';
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
  _dbRoom: RoomDetailModel = new RoomDetailModel();
  _assetsData: AssetModel[] = [];

  _selectedMember: number | null = null;
  _currentImage = '../../assets/images/avatar_error.png';

  _deletedImages: string[] = [];
  _addedImages: RoomImageModel[] = [];

  _deleteMembers: number[] = [];
  _addedMembers: string[] = [];

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
        this._dbRoom = { ...data };
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

  changeImage(image: string) {
    this._currentImage = image;
  }

  onAddMember(cccd: string) {
    console.log('Add member CCCD:', cccd);
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
      this._deleteMembers.push(memberID);
      this._roomDetail.members.splice(index, 1);
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
    if (val && val.quantity > 0) {
      val.quantity += quan;
    }
  }

  onDeleteImage() {
    const index = this._roomDetail.urlRoomImages.indexOf(this._currentImage);
    if (index > -1) {
      this._roomDetail.urlRoomImages.splice(index, 1);
      this._deletedImages.push(this._currentImage);

      if (this._roomDetail.urlRoomImages.length > 0) {
        const nextIndex = Math.min(
          index,
          this._roomDetail.urlRoomImages.length - 1
        );
        this._currentImage = this._roomDetail.urlRoomImages[nextIndex];
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

    //images
    console.log(this._deletedImages);

    //members

    // const formDataToSend = new FormData();

    // formDataToSend.append('roomID', this._roomDetail.roomID.toString());
    // formDataToSend.append('roomCode', this._roomDetail.roomNumber);
    // formDataToSend.append('area', this._roomDetail.area.toString());
    // formDataToSend.append('price', this._roomDetail.price.toString());
    // formDataToSend.append('description', this._roomDetail.description);

    // this._deleteMembers.forEach((id) =>
    //   formDataToSend.append('deleteMembers', id.toString())
    // );
    // this._deletedImages.forEach((img) =>
    //   formDataToSend.append('deletedImages', img)
    // );

    // for (const pair of formDataToSend.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);
    // }
  }

  trackByAssetID(index: number, asset: AssetModel): number {
    return asset.assetID;
  }
}
