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
import { AssetService } from '../../services/assetservice';
import { MatOptionSelectionChange } from '@angular/material/core';
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
  _deleteMembers: number[] = [];
  _addedMembers: string[] = [];
  _selectedAssets: {
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
    this.loadAssets();
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

        console.log(this._selectedAssets);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading room detail:', error);
      },
    });
  }

  loadAssets() {
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
    });
  }

  defSelectedMember(id: number) {
    this._selectedMember = id;
  }

  get getAssetData(): any[] {
    return this._roomDetail?.assetData || [];
  }

  changeImage(image: string) {
    this._currentImage = image;
  }

  onAddMember(cccd: string) {
    console.log('Add member CCCD:', cccd);
  }

  onAddContract() {
    console.log('Create contract');
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

  onAddAsset() {
    console.log('Assets Selected:', this.selectedAssetsID.value);
  }

  onOptionChange(event: MatOptionSelectionChange, assetID: number) {
    const state = event.source.selected ? '✅ CHECK' : '❌ UNCHECK';
    console.log(`${state}:`, assetID);
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

  onUpdateRoom() {
    const formDataToSend = new FormData();

    formDataToSend.append('roomID', this._roomDetail.roomID.toString());
    formDataToSend.append('roomCode', this._roomDetail.roomNumber);
    formDataToSend.append('area', this._roomDetail.area.toString());
    formDataToSend.append('price', this._roomDetail.price.toString());
    formDataToSend.append('description', this._roomDetail.description);

    this._deleteMembers.forEach((id) =>
      formDataToSend.append('deleteMembers', id.toString())
    );
    this._deletedImages.forEach((img) =>
      formDataToSend.append('deletedImages', img)
    );

    for (const pair of formDataToSend.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  }

  trackByAssetID(index: number, asset: AssetModel): number {
    return asset.assetID;
  }
}
