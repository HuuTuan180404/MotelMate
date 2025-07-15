import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  mainMenu = [
    { icon: 'dashboard', label: 'Dashboard', route: '#' },
    { icon: 'apartment', label: 'Building', route: 'buildings' },
    { icon: 'bed', label: 'Room', route: 'rooms' },
    { icon: 'server_person', label: 'Tenant', route: '#' },
    { icon: 'contract', label: 'Contract', route: 'contracts' },
    { icon: 'receipt', label: 'Invoice', route: 'invoices' },
    { icon: 'inventory_2', label: 'Asset', route: '#' },
  ];

  accountMenu = [
    { icon: 'settings', label: 'Setting', route: '#' },
    { icon: 'exit_to_app', label: 'Logout', route: '#' },
  ];
}
