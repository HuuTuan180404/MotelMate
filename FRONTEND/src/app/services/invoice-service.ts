import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReadInvoice, ReadInvoiceDetail, UpdateInvoice, BatchInvoiceDto, InvoiceDraftDto, OwnerBankInfo } from '../models/Invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/api/invoice`;

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<ReadInvoice[]> {
    return this.http.get<ReadInvoice[]>(this.apiUrl);
  }

  getInvoicesForTenant(): Observable<ReadInvoice[]> {
    return this.http.get<ReadInvoice[]>(`${this.apiUrl}/fortenant`);
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

  getInvoiceDrafts(buildingId: number, periodStart: string, periodEnd: string, dueDate: string): Observable<InvoiceDraftDto[]> {
    return this.http.get<InvoiceDraftDto[]>(`${this.apiUrl}/Draft`, {
      params: {
        buildingId: buildingId.toString(),
        periodStart: periodStart,
        periodEnd: periodEnd,
        dueDate: dueDate
      }
    });
  }

  batchCreateWithNotification(data: BatchInvoiceDto[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/BatchCreateWithNotification`, data);
  }

  createPaymentRequest(invoiceId: number, imageUrl: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${invoiceId}/create-payment-request`, {
      imageUrl: imageUrl
    });
  }


  getOwnerBankInfo(invoiceId: number): Observable<OwnerBankInfo> {
    return this.http.get<OwnerBankInfo>(`${this.apiUrl}/${invoiceId}/owner-bank-info`);
  }


}
