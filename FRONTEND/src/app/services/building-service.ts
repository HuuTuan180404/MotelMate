import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Building } from '../models/Building.model';

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  private apiUrl = `${environment.apiUrl}/api/building`;

  constructor(private http: HttpClient) {}

  getBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(this.apiUrl);
  }

  deleteBuilding(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addBuilding(building: Partial<Building>): Observable<Building> {
    return this.http.post<Building>(this.apiUrl, building);
  }

  updateBuilding(id: number, data: Partial<Building>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // lấy tòa nhà và phòng của tòa nhà - Tu
  getBuildingWithRooms(): Observable<object[]> {
    return this.http.get<object[]>(`${environment.apiUrl}/api/noti/with-rooms`);
  }
}
