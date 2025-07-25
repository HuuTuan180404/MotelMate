import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceItem } from '../models/Service.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiService = `${environment.apiURL.serviceApi}`;
  constructor(private http: HttpClient) {}

  getAllServices(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>(this.apiService);
  }
  
  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiService}/${id}`);
  }

  editService(service: ServiceItem): Observable<any> {
    return this.http.put(`${this.apiService}/${service.serviceID}`, service);
  }
  
  createService(service: ServiceItem): Observable<any> {
  return this.http.post(`${this.apiService}`, service);
}

}
