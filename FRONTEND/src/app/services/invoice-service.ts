import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReadInvoice, ReadInvoiceDetail, UpdateInvoice } from '../models/Invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/api/invoice`;

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<ReadInvoice[]> {
    return this.http.get<ReadInvoice[]>(this.apiUrl);
  }

  getInvoiceDetail(id: number): Observable<ReadInvoiceDetail> {
    return this.http.get<ReadInvoiceDetail>(`${this.apiUrl}/${id}`);
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateInvoice(id: number, data: UpdateInvoice): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

}
