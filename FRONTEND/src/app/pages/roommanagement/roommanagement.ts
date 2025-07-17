import { Component } from '@angular/core';
import { Room } from './room/room';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RoomDetail } from '../roomdetail/roomdetail';

@Component({
  selector: 'app-roommanagement',
  imports: [
    RoomDetail,
    Room,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatTooltip,
    MatDialogModule,
  ],
  templateUrl: './roommanagement.html',
  styleUrl: './roommanagement.css',
})
export class RoomManagement {
  constructor(private dialog: MatDialog) {}
  options = [
    { name: 'All', code: -1 },
    { name: 'One', code: 1 },
    { name: 'Two', code: 2 },
    { name: 'Three', code: 3 },
  ];
  buildingCode: any = null;
  searchText: string = '';

  ngOnInit() {
    this.buildingCode = this.options[0].code;
  }

  onClick_btnCreate() {
    this.dialog.open(RoomDetail, {
      disableClose: true,
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { roomId: 123, mode: 'edit' },
    });
  }

  rooms = [
    {
      images: [],
      name: 'R201',
      price: '1.300.000đ',
      maxGuest: 3,
      avatars: [
        { url: 'assets/images/logo.svg', alt: '' },
        { url: 'assets/images/roomtest.jpg', alt: '' },
      ],
      status: 'Available',
    },
    {
      images: [],
      name: 'R201',
      price: '1.300.000đ',
      maxGuest: 3,
      avatars: [],
      status: 'Available',
    },
    {
      images: [],
      name: 'R201',
      price: '1.300.000đ',
      maxGuest: 3,
      avatars: [],
      status: 'Available',
    },
    {
      images: [],
      name: 'R201',
      price: '1.300.000đ',
      maxGuest: 3,
      avatars: [],
      status: 'Available',
    },
    {
      images: [],
      name: 'R201',
      price: '1.300.000đ',
      maxGuest: 3,
      avatars: [],
      status: 'Available',
    },
    {
      images: [],
      name: 'R201',
      price: '1.300.000đ',
      maxGuest: 3,
      avatars: [],
      status: 'Available',
    },
    {
      images: [],
      name: 'R201',
      price: '1.300.000đ',
      maxGuest: 3,
      avatars: [],
      status: 'Available',
    },
    {
      images: [],
      name: 'R201',
      price: '1.300.000đ',
      maxGuest: 3,
      avatars: [],
      status: 'Maintenance',
    },
    {
      images: [],
      name: 'R201',
      price: '1.300.000đ',
      maxGuest: 3,
      avatars: [],
      status: 'Occupied',
    },
  ];
}
