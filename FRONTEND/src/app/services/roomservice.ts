import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RoomModel } from '../models/Room.model';
import { RoomDetail } from '../pages/roomdetail/roomdetail';
import { RoomDetailModel } from '../models/RoomDetail.model';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getAllRooms(): Observable<RoomModel[]> {
    return this.http.get<RoomModel[]>(`${this.apiUrl}/room`);
  }

  getRoomById(id: number): Observable<RoomDetailModel> {
    return this.http.get<RoomDetailModel>(`${this.apiUrl}/room/${id}`);
  }

  postNewRoom(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/room/add-room`, formData);
  }
}
