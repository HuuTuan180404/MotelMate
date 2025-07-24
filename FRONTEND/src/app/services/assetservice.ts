import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantModel } from '../models/Tenant.model';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private apiTenant = `${environment.apiURL.getAsset}/asset`;
  constructor(private http: HttpClient) {}

  getAllAssets(): Observable<TenantModel[]> {
    return this.http.get<TenantModel[]>(this.apiTenant);
  }
}
