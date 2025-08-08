import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ContractDTO {
  contractID: number;
  contractCode: string;
  contractHolder: string;
  buildingName: string;
  roomNumber: string;
  startDate: string;
  endDate: string;
  status: string;
}
export interface CreateContractDTO {
  buildingID: number;
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
  private api = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getAllContracts(): Observable<ContractDTO[]> {
    return this.http.get<ContractDTO[]>(`${this.apiUrl}`);
  }

  createContract(dto: CreateContractDTO): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/Contract/create`, dto);
  }

  terminateContractByRoomID(roomID: number): Observable<any> {
    return this.http.post(`${this.api}/Contract/terminate-by-room`, roomID);
  }
  downloadContractPdf(roomId: number): Observable<Blob> {
    return this.http.get(
      `${this.api}/PDF/download-contract-pdf`,
      {
        params: { RoomID: roomId },
        responseType: 'blob', 
      }
    );
  }
  downloadInvoicePdfByContractId(contractId: number): Observable<Blob> {
    return this.http.get(
      `${this.api}/PDF/download-contract-pdf-by-contractid`,
      {
        params: { ContractID: contractId },
        responseType: 'blob', 
      }
    );
  }
  getContractUnsignedByRoomID(roomId: number): Observable<any> {
    return this.http.get(`${this.api}/Contract/get-contract-unsigned `, {
      params: { roomID: roomId },
    });
  }

  signContract(): Observable<any> {
    return this.http.patch(`${this.api}/Contract/sign-contract`, {});
  }
}
