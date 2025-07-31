import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RoomModel } from '../models/Room.model';
import { RoomDetail } from '../pages/roomdetail/roomdetail';
// import { RoomStatus } from '../pages/roommanagement/roommanagement';
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface RoomFilters {
  page: number;
  size: number;
  searchText?: string;
  minPrice?: number;
  maxPrice?: number;
  buildingCode?: number;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl = 'your-api-url';

  constructor(private http: HttpClient) {}

  getAllRooms(): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>(`${environment.apiURL.getTenant}/room`);
  }

  getRoomById(id: number): Observable<RoomDetail> {
    return this.http.get<RoomDetail>(
      `${environment.apiURL.getTenant}/room/${id}`
    );
  }
}
