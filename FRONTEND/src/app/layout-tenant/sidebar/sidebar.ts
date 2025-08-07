import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { on } from 'events';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isRequestMenuOpen = false;
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
  mainMenu = [
    { icon: 'dashboard', label: 'Dashboard', route: 'dashboard' },
    { icon: 'bed', label: 'Room', route: 'room' },
    { icon: 'contract', label: 'Contract', route: '' },
    { icon: 'receipt', label: 'Invoice', route: 'invoices' },
     {
      icon: 'request_page',
      label: 'Requests',
      isDropdown: true,
      children: [
        {
          icon: 'app_registration',
          label: 'Room Registration',
          route: 'requests/room-registration',
        },
        {
          icon: 'update',
          label: 'Extend Contract',
          route: 'requests/extend-contract',
        },
        { icon: 'payment', label: 'Payment', route: 'requests/payment' },
        {
          icon: 'feedback',
          label: 'Feedback/Issue',
          route: 'requests/feedbackorissue',
        },
      ],
    },
  ];

  accountMenu = [
    { icon: 'settings', label: 'Setting', route: '#' },
    {
      icon: 'exit_to_app',
      label: 'Logout',
      route: '#',
      action: () => this.logout(),
    },
  ];
  toggleRequestMenu() {
    this.isRequestMenuOpen = !this.isRequestMenuOpen;
  }
}
