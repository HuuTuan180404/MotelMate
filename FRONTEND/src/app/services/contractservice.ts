import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ContractDTO {
  contractCode: string;
  contractHolder: string;
  buildingName: string;
  roomNumber: string;
  startDate: string;
  endDate: string;
  status: string;
}
export interface CreateContractDTO {
  buildingName: string;
  roomNumber: string;
  startDate: string;
  endDate: string;
  deposit: number;
  price: number;
  cccd: string;
}

@Injectable({ providedIn: 'root' })
export class ContractService {
  private apiUrl = `${environment.apiUrl}/api/Contract/all`;

  constructor(private http: HttpClient) {}

  getAllContracts(): Observable<ContractDTO[]> {
    return this.http.get<ContractDTO[]>(`${this.apiUrl}`);
  }
  createContract(dto: CreateContractDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/Contract/create`, dto);
  }
}
