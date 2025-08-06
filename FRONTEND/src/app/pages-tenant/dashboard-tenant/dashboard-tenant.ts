import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RoomModel } from '../../models/Room.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../services/roomservice';
import { error } from 'console';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard-tenant',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard-tenant.html',
  styleUrl: './dashboard-tenant.css',
})
export class DashboardTenant implements AfterViewInit, OnInit {
  searchText: string = '';
  _allRoom: RoomModel[] = [];

  dataSource: MatTableDataSource<RoomModel> = new MatTableDataSource(
    this._allRoom
  );

  _displayedColumns: string[] = [
    'roomNumber',
    'price',
    'area',
    'members',
    'address',
    'status',
    'actions',
  ];

  constructor(
    private dialog: MatDialog,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.roomService.getAllRooms_Tenant().subscribe({
      next: (data) => {
        this._allRoom = data;
        this.dataSource.data = this._allRoom;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onApply(roomID: number) {
    console.log('apply this room ', roomID);
  }
}
