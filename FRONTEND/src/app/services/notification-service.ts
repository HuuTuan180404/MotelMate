import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ReadNotificationDTO } from '../models/Notification.model';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private api = `${environment.apiUrl}/api`;
  private hubConnection: signalR.HubConnection | null = null;
  private hasNewNotificationSubject = new BehaviorSubject<boolean>(false);
  public hasNewNotification$ = this.hasNewNotificationSubject.asObservable();

  constructor(private http: HttpClient) {}

  sendNotification(data: any): Observable<any> {
    return this.http.post(`${this.api}/Notification/send-notification`, data);
  }

  tenantGetNotification(): Observable<ReadNotificationDTO[]> {
    return this.http.get<ReadNotificationDTO[]>(
      `${this.api}/Notification/tenant-get-notification`
    );
  }

  // set is read
  isReadNotification(notificationID: number[]): Observable<any> {
    return this.http.patch<any>(
      `${this.api}/Notification/is-read-notification`,
      notificationID
    );
  }

  startConnection() {
    if (this.hubConnection) {
      return;
    }

    const token =
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken');

    console.log('Token from storage:', token);

    if (!token) {
      console.error('❌ Token is missing! Cannot connect to SignalR.');
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/notificationHub`, {
        accessTokenFactory: () => token || '',

        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        this.joinUserGroup();
        this.registerOnServerEvents();
        this.checkInitialNotificationState();
      })
      .catch((err) => {
        console.error('Error while starting SignalR connection: ', err);
      });
  }

  private joinUserGroup() {
    if (this.hubConnection) {
      // BE sẽ tự lấy tenant ID từ token
      this.hubConnection
        .invoke('JoinUserGroup')
        .catch((err) => console.error('Error joining group: ', err));
    }
  }

  private registerOnServerEvents() {
    if (this.hubConnection) {
      this.hubConnection.on('NewNotification', (data) => {
        console.log('Received new notification:', data);
        this.hasNewNotificationSubject.next(data.hasNewNotification);
      });
    }
  }

  private checkInitialNotificationState() {
    this.checkNewNotification().subscribe({
      next: (hasNew) => {
        this.hasNewNotificationSubject.next(hasNew);
      },
      error: (err) => {
        console.error('Error checking initial notification state:', err);
      },
    });
  }

  checkNewNotification() {
    return this.http.get<boolean>(
      `${this.api}/notification/has-new-notification`
    );
  }

  public stopConnection() {
    if (this.hubConnection) {
      this.hubConnection
        .stop()
        .then(() => {
          console.log('SignalR Disconnected');
          this.hubConnection = null;
        })
        .catch((err) => console.error('Error stopping connection: ', err));
    }
  }
}
