import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantModel } from '../models/Tenant.model';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private apiTenant = `${environment.apiURL.getTenant}/tenant`;
  constructor(private http: HttpClient) {}

  getAllTenants(): Observable<TenantModel[]> {
    return this.http.get<TenantModel[]>(this.apiTenant);
  }

  getTenantDetail(id: number): Observable<TenantModel> {
    return this.http.get<TenantModel>(`${this.apiTenant}/${id}`);
  }
}
