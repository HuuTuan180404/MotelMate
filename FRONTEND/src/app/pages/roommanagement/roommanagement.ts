import { Component } from '@angular/core';
import { Room } from './room/room';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-roommanagement',
  imports: [
    Room,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './roommanagement.html',
  styleUrl: './roommanagement.css',
})
export class RoomManagement {
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
