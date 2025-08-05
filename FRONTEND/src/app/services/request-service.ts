import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EnumModel } from '../models/Enum.model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private apiUrl = `${environment.apiUrl}/api/Request`;
  private api = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getRequests(type: string, status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?type=${type}&status=${status}`);
  }

  approveRequest(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectRequest(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/reject`, {});
  }

  // ==========TENANT==================
  getRequestType(): Observable<EnumModel[]> {
    return this.http.get<EnumModel[]>(`${this.api}/enum/request-types`);
  }

  createRequest(formData: FormData): Observable<any> {
    return this.http.post(`${this.api}/request/create-request`, formData);
  }
}
