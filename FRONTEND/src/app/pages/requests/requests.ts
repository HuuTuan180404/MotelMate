import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestService } from '../../services/request-service';
import { RequestModel } from '../../models/Request.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImageDialogComponent } from './ImageDialog';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './requests.html',
  styleUrl: './requests.css'
})
export class Requests implements OnInit {
  searchTerm: string = '';
  selectedStatus: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
  requestType: string = 'Payment';
  requests: RequestModel[] = [];
  filteredRequests: RequestModel[] = [];

  constructor(
    private requestService: RequestService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      const lastSegment = urlSegments[urlSegments.length - 1]?.path;
      if (lastSegment) {
        this.requestType = this.mapUrlToRequestType(lastSegment);
        this.loadRequests();
      }
    });
  }
  formatTitle(input: string): string {
    return input
      .replace(/([A-Z])/g, ' $1') // Tách trước các chữ in hoa
      .replace(/^\s/, '')          // Xóa khoảng trắng đầu (nếu có)
  }

  mapUrlToRequestType(urlSegment: string): string {
    switch (urlSegment) {
      case 'payment':
        return 'Payment';
      case 'room-registration':
        return 'RoomRegistration';
      case 'feedbackorissue':
        return 'FeedbackOrIssue';
      case 'extend-contract':
        return 'ExtendContract';
      default:
        return 'Payment';
    }
  }

  loadRequests() {
    this.requestService.getRequests(this.requestType, this.selectedStatus).subscribe((data: RequestModel[]) => {
      this.requests = data;
      this.applyFilters();
    });
  }

  changeTab() {
    this.loadRequests();
  }

  applyFilters() {
    const term = this.searchTerm.toLowerCase();
    this.filteredRequests = this.requests.filter(request =>
      request.title.toLowerCase().includes(term) ||
      (request.roomName?.toLowerCase().includes(term) ?? false) ||
      (request.buildingName?.toLowerCase().includes(term) ?? false)
    );
  }

  approveRequest(request: RequestModel) {
    this.requestService.approveRequest(request.requestID).subscribe(() => {
      request.status = 'Approved';
      this.snackBar.open('Request Approved!', 'Close', { duration: 2000 });
      this.applyFilters();
    });
  }

  rejectRequest(request: RequestModel) {
    this.requestService.rejectRequest(request.requestID).subscribe(() => {
      request.status = 'Rejected';
      this.snackBar.open('Request Rejected!', 'Close', { duration: 2000 });
      this.applyFilters();
    });
  }
  viewImage(imageUrl: string) {
  this.dialog.open(ImageDialogComponent, {
    data: imageUrl,
    panelClass: 'custom-dialog'
  });
}
}
