import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomModel } from '../models/Room.model';
import { RoomDetail } from '../pages/roomdetail/roomdetail';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
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
