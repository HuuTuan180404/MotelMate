import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private api = `${environment.apiUrl}/api`;
  constructor(private http: HttpClient) {}

  sendNotification(data: any): Observable<any> {
    return this.http.post(`${this.api}/Notification/send-notification`, data);
  }

  tenantGetNotification(): Observable<any> {
    return this.http.get(`${this.api}/Notification/tenant-get-notification`);
  }
}
