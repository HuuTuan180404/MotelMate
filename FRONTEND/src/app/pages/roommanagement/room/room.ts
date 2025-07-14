import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-room',
  imports: [CommonModule],
  templateUrl: './room.html',
  styleUrl: './room.css',
})
export class Room {
  @Input() room: any;
}
