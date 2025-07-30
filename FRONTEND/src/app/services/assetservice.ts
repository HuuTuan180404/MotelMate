import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantModel } from '../models/Tenant.model';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private apiTenant = `${environment.apiURL.getAsset}/asset`;
  constructor(private http: HttpClient) {}

  getAllAssets(): Observable<TenantModel[]> {
    var accessToken = sessionStorage.getItem('accessToken');
    // const {
    //   ['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']:
    //     userId,
    //   ['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']: username,
    //   ['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']: role,
    // } = jwtDecode<any>(accessToken || '');
    // console.log(userId, username, role);

    console.log(accessToken);

    return this.http.get<TenantModel[]>(`${this.apiTenant}`);
  }
}
