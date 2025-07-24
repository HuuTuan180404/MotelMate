import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RoomModel } from '../../../models/Room.model';

@Component({
  selector: 'app-room',
  imports: [CommonModule],
  templateUrl: './room.html',
  styleUrl: './room.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Room {
  @Input() room!: RoomModel;
}
