import {
  Component,
  ElementRef,
  HostListener,
  Inject,
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
import { TenantModel } from '../../models/Tenant.model';

@Component({
  selector: 'app-roomdetail',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './roomdetail.html',
  styleUrl: './roomdetail.css',
})
export class RoomDetail {
  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;
  @ViewChild('scrollContainerThumbnails', { static: true })
  scrollContainerThumbnails!: ElementRef;
  selectedMember: number | null = null;

  roomMembers: TenantModel[] = [];
  //   {
  //     tenantID: 1,
  //     urlAvatar:
  //       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=600&q=80',
  //     name: 'Nguyễn Văn A',
  //     fullName: 'Active',
  //     phoneNumber: '0987654321',
  //     room: '101A',
  //     bdate: new Date('1995-03-15'),
  //   },
  //   {
  //     tenantID: 2,
  //     urlAvatar:
  //       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=600&q=80',
  //     name: 'Nguyễn Văn A',
  //     fullName: 'Active',
  //     phoneNumber: '0987654321',
  //     room: '101A',
  //     bdate: new Date('1995-03-15'),
  //   },
  //   {
  //     tenantID: 3,
  //     urlAvatar:
  //       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=600&q=80',
  //     name: 'Nguyễn Văn A',
  //     fullName: 'Active',
  //     phoneNumber: '0987654321',
  //     room: '101A',
  //     bdate: new Date('1995-03-15'),
  //   },
  //   {
  //     tenantID: 4,
  //     urlAvatar: 'https://randomuser.me/api/portraits/women/21.jpg',
  //     name: 'Trần Thị B',
  //     fullName: 'Terminate',
  //    phoneNumber: '0912345678',
  //     room: '102B',
  //     bdate: new Date('1990-07-20'),
  //   },
  //   {
  //     tenantID: 5,
  //     urlAvatar: 'https://randomuser.me/api/portraits/women/21.jpg',
  //     name: 'Trần Thị B',
  //     fullName: 'Terminate',
  //     phoneNumber: '0912345678',
  //     room: '102B',
  //     bdate: new Date('1990-07-20'),
  //   },
  // ];

  defSelectedMember(id: number) {
    this.selectedMember = id;
  }

  defDeleteMember() {
    if (this.selectedMember !== null) {
      this.roomMembers = this.roomMembers.filter(
        (item) => item.tenantID !== this.selectedMember
      );
      this.selectedMember = null; // Clear selection
    }
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RoomDetail>
  ) {}

  staticImages = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=600&q=80',
  ];

  assets = [
    { code: 1, name: 'Máy lạnh', quantity: 1 },
    { code: 2, name: 'Giường', quantity: 2 },
    { code: 3, name: 'Giường', quantity: 3 },
    { code: 4, name: 'Giường', quantity: 4 },
    { code: 5, name: 'Giường', quantity: 5 },
    { code: 6, name: 'Giường', quantity: 6 },
    { code: 7, name: 'Giường', quantity: 7 },
    { code: 5, name: 'Giường', quantity: 5 },
    { code: 6, name: 'Giường', quantity: 6 },
    { code: 7, name: 'Giường', quantity: 7 },
    { code: 5, name: 'g', quantity: 5 },
    { code: 6, name: 'Giường', quantity: 6 },
    { code: 7, name: 'Giường', quantity: 7 },
    { code: 5, name: 'Giường', quantity: 5 },
    { code: 6, name: 'Giường', quantity: 6 },
    { code: 7, name: 'Giường', quantity: 7 },
    { code: 5, name: 'Giường', quantity: 5 },
    { code: 6, name: 'Giường', quantity: 6 },
    { code: 7, name: 'Giường', quantity: 7 },
  ];

  currentImage = this.staticImages[0];

  changeImage(image: string) {
    this.currentImage = image;
  }

  ngAfterViewInit() {
    const el = this.scrollContainer.nativeElement;
    const scrollContainerThumbnails =
      this.scrollContainerThumbnails.nativeElement;

    el.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        if (event.deltaY !== 0) {
          event.preventDefault();
          el.scrollLeft += event.deltaY;
        }
      },
      { passive: false }
    );

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

  onClick_btnAddMember() {
    console.log('dads');
  }

  // component.ts
  // @HostListener('document:keydown.delete', ['$event'])
  // handleDeleteKey(event: KeyboardEvent) {
  //   if (this.selectedMember !== null) {
  //     this.defDeleteMember();
  //   }
  // }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.defDeleteMember();
    }
  }
}
