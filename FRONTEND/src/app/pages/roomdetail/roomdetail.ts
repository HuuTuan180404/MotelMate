import {
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
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RoomDetailModel } from '../../models/RoomDetail.model';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { TenantModel } from '../../models/Tenant.model';
@Component({
  selector: 'app-roomdetail',
  imports: [
    MatChipsModule,
    MatCardModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: './roomdetail.html',
  styleUrl: './roomdetail.css',
})
export class RoomDetail {
  @ViewChild('scrollContainerThumbnails', { static: true })
  _scrollContainerThumbnails!: ElementRef;

  _roomDetail: RoomDetailModel;
  _selectedMember: number | null = null;
  _currentImage = '../../assets/images/avatar_error.png';

  constructor(
    @Inject(MAT_DIALOG_DATA) private roomDetail: RoomDetailModel,
    public dialogRef: MatDialogRef<RoomDetail>
  ) {
    this._roomDetail = JSON.parse(JSON.stringify(roomDetail));
    if (this.roomDetail.urlRoomImages.length > 0) {
      this._currentImage = this.roomDetail.urlRoomImages[0];
    }
  }

  defSelectedMember(id: number) {
    this._selectedMember = id;
  }

  defDeleteMember() {
    if (!this._roomDetail?.members || this._selectedMember === null) return;

    this._roomDetail = {
      ...this._roomDetail,
      members: this._roomDetail.members.filter(
        (item) => item.id !== this._selectedMember
      ),
    };

    this._selectedMember = null;

    console.log('Deleted member ID:', this._selectedMember);
  }

  get getAssetData(): any[] {
    return this.roomDetail.assetData as any[];
  }

  changeImage(image: string) {
    this._currentImage = image;
  }

  ngAfterViewInit() {
    const scrollContainerThumbnails =
      this._scrollContainerThumbnails.nativeElement;

    scrollContainerThumbnails.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        if (event.deltaY !== 0) {
          event.preventDefault();
          scrollContainerThumbnails.scrollLeft += event.deltaY;
        }
      },
      { passive: false }
    );
  }

  room = {};

  onAddMember() {
    console.log('onAddMember()');
  }

  onAddAsset() {
    console.log('onAddAsset()');
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.defDeleteMember();
    }
  }
}
