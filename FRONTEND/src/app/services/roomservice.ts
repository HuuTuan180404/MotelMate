import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RoomModel } from '../models/Room.model';
import { RoomDetail } from '../pages/roomdetail/roomdetail';
import { RoomStatus } from '../pages/roommanagement/roommanagement';

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

  // của building service
  getBuildingWithRooms(): Observable<object[]> {
    return this.http.get<object[]>(
      `${environment.apiURL.getTenant}/noti/with-rooms`
    );
  }
  // =================================

  private rooms: RoomModel[] = [
    {
      roomID: 1,
      roomNumber: '101',
      price: 5000000,
      status: RoomStatus.AVAILABLE,
      buildingID: 1,
      buildingName: 'Tòa A',
      urlImage:
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      urlAvatars: [],
    },
    {
      roomID: 2,
      roomNumber: '102',
      price: 6000000,
      status: RoomStatus.OCCUPIED,
      buildingID: 1,
      buildingName: 'Tòa A',
      urlImage:
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      urlAvatars: [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      ],
    },
    {
      roomID: 3,
      roomNumber: '201',
      price: 5500000,
      status: RoomStatus.MAINTAIN,
      buildingID: 2,
      buildingName: 'Tòa B',
      urlImage:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      urlAvatars: [],
    },
    {
      roomID: 4,
      roomNumber: '202',
      price: 7000000,
      status: RoomStatus.OCCUPIED,
      buildingID: 2,
      buildingName: 'Tòa B',
      urlImage:
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      urlAvatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      ],
    },
    {
      roomID: 5,
      roomNumber: '301',
      price: 6500000,
      status: RoomStatus.AVAILABLE,
      buildingID: 3,
      buildingName: 'Tòa C',
      urlImage:
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
      urlAvatars: [],
    },
    {
      roomID: 6,
      roomNumber: '302',
      price: 8000000,
      status: RoomStatus.OCCUPIED,
      buildingID: 3,
      buildingName: 'Tòa C',
      urlImage:
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
      urlAvatars: [
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      ],
    },
  ];

  getRooms(): Observable<RoomModel[]> {
    return of(this.rooms);
  }
}
