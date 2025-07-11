import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Output() toggle = new EventEmitter<void>();
  toggleSidebar() {
    this.toggle.emit();
  }
}
