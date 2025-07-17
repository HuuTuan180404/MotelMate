import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-building',
  imports: [CommonModule],
  templateUrl: './building.html',
  styleUrl: './building.css'
})
export class Building {
  @Input() building: any;
}

