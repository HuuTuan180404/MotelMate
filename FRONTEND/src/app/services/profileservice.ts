// src/app/services/profile.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProfileDTO {
  urlAvatar: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  bdate: string;
  bankCode: string;
  accountNo: string;
  accountName: string;
  role: string;
}


@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly api = '/api/profile';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ProfileDTO> {
    return this.http.get<ProfileDTO>(`${environment.apiUrl}/api/Account/get-profile`);
  }

  updateProfile(formData: FormData): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/api/Account/update-profile`, formData);
  }

}
