import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantModel } from '../models/Tenant.model';
import { jwtDecode } from 'jwt-decode';
import { AssetModel } from '../models/Asset.model';
import { EnumModel } from '../models/Enum.model';
@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private api = `${environment.apiUrl}/api`;
  constructor(private http: HttpClient) {}

  getAddAssetTypes(): Observable<EnumModel[]> {
    return this.http.get<EnumModel[]>(`${this.api}/enum/asset-types`);
  }

  getAllAssets(): Observable<AssetModel[]> {
    return this.http.get<AssetModel[]>(`${this.api}/asset`);
  }

  createAsset(asset: AssetModel): Observable<AssetModel> {
    return this.http.post<AssetModel>(`${this.api}/asset/add-asset`, asset);
  }
}
