import { Component } from '@angular/core';
import { Room } from './room/room';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roommanagement',
  imports: [Room, CommonModule],
  templateUrl: './roommanagement.html',
  styleUrl: './roommanagement.css',
})
export class RoomManagement {
  rooms = [
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
  ];
}
