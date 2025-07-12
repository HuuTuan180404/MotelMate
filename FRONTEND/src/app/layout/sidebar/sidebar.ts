import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Output() toggle = new EventEmitter<void>();

  mainMenu = [
    { icon: 'dashboard', label: 'Dashboard', route: '#' },
    { icon: 'bed', label: 'Room', route: '#' },
    { icon: 'apartment', label: 'Building', route: '#' },
    { icon: 'contract', label: 'Contract', route: '#' },
    { icon: 'receipt', label: 'Payment', route: '#' },
    { icon: 'inventory_2', label: 'Asset', route: '#' },
  ];

  accountMenu = [
    { icon: 'settings', label: 'Setting', route: '#' },
    { icon: 'exit_to_app', label: 'Logout', route: '#' },
  ];

  toggleSidebar() {
    this.toggle.emit();
  }
}
