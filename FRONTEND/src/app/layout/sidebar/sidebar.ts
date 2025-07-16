import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isRequestMenuOpen = false;

  mainMenu = [
    { icon: 'dashboard', label: 'Dashboard', route: '#' },
    { icon: 'apartment', label: 'Building', route: 'buildings' },
    { icon: 'bed', label: 'Room', route: 'rooms' },
    { icon: 'server_person', label: 'Tenant', route: 'tenants' },
    { icon: 'contract', label: 'Contract', route: 'contracts' },
    { icon: 'receipt', label: 'Invoice', route: 'invoices' },
    { icon: 'inventory_2', label: 'Asset', route: '#' },
    { 
      icon: 'request_page', 
      label: 'Requests', 
      isDropdown: true,
      children: [
        { icon: 'app_registration', label: 'Room Registration', route: 'requests/room-registration' },
        { icon: 'update', label: 'Extend Contract', route: 'requests/extend-contract' },
        { icon: 'payment', label: 'Payment', route: 'requests/payment' },
        { icon: 'feedback', label: 'Feedback/Issue', route: 'requests/feedback' }
      ]
    }
  ];

  accountMenu = [
    { icon: 'settings', label: 'Setting', route: '#' },
    { icon: 'exit_to_app', label: 'Logout', route: '#' },
  ];
  toggleRequestMenu() {
    this.isRequestMenuOpen = !this.isRequestMenuOpen;
  }
}
