import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantModel } from '../models/Tenant.model';
import { jwtDecode } from 'jwt-decode';
import { AssetModel } from '../models/Asset.model';
@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private api = `${environment.apiUrl}/api`;
  constructor(private http: HttpClient) {}

  getAllAssets(): Observable<AssetModel[]> {
    return this.http.get<AssetModel[]>(`${this.api}/asset`);
  }
}
