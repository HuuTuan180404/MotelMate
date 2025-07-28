import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceItem } from '../models/Service.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/api/service`;

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>(this.apiUrl);
  }
  
  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  editService(service: ServiceItem): Observable<any> {
    return this.http.put(`${this.apiUrl}/${service.serviceID}`, service);
  }
  
  createService(service: ServiceItem): Observable<any> {
    return this.http.post(this.apiUrl, service);
  }
}
