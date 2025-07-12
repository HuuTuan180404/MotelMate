import { Component } from '@angular/core';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { RoomManagement } from '../pages/roommanagement/roommanagement';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, Header, RoomManagement],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class Layout {
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
