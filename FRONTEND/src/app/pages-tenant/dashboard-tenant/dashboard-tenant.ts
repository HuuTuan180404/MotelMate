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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestService } from '../../services/request-service';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterRoomDialog } from './register-room-dialog/register-room-dialog';
import { RegisterRoomRequest } from '../../models/Request.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './dashboard-tenant.html',
  styleUrl: './dashboard-tenant.css',
})
export class DashboardTenant implements AfterViewInit {
  searchText: string = '';
  _allRoom!: RoomModel[];
  pendingRoomIDs: number[] = [];


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
    private requestService: RequestService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    // Gọi API lấy danh sách phòng
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

    // 👉 Gọi API lấy request đăng ký phòng đang pending
    this.requestService.getRequests('RoomRegistration', 'Pending').subscribe({
      next: (requests) => {
        this.pendingRoomIDs = requests.map((r) => r.roomID);
      },
      error: (err) => {
        console.error('Failed to fetch pending requests:', err);
      }
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

  onRegisterRoom(roomID: number) {
    const dialogRef = this.dialog.open(RegisterRoomDialog, {
      width: '1000px',
      data: { roomID },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const payload: RegisterRoomRequest = {
          roomID,
          startDate: formatDate(result.startDate, 'yyyy-MM-dd', 'en-US'),
          endDate: formatDate(result.endDate, 'yyyy-MM-dd', 'en-US'),
        };

        this.requestService.registerRoom(payload).subscribe({
          next: () => {
            this.snackBar.open('Room registration request sent!', 'Close', {
              duration: 3000,
              panelClass: 'custom-snackbar-success',
              verticalPosition: 'top',
            });
            this.pendingRoomIDs.push(roomID);
          },
          error: (err) => {
            const message = err.error?.message || 'Failed to register room.';
            this.snackBar.open(message, 'Close', {
              duration: 3000,
              panelClass: 'custom-snackbar',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
}

}
