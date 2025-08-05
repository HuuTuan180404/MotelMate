export interface ReadInvoice {
  invoiceID: number;
  invoiceCode: string;
  building: string;
  room: string;
  month: string; // "yyyy-MM"
  due: string;   // yyyy-MM-dd
  total: number;
  status: string;
}

export interface ExtraCost {
  extraCostID: number;
  description: string;
  amount: number;
}

export interface ServiceDetail {
  serviceID: number;
  name: string;
  quantity: number;
  unit: string;
  initialPrice: number;
  price: number;
}

export interface ReadInvoiceDetail {
  invoiceID: number;
  invoiceCode: string;
  building: string;
  room: string;
  month: string;
  periodStart: string;   // yyyy-MM-dd
  periodEnd: string;     // yyyy-MM-dd
  due: string;           // yyyy-MM-dd
  createAt: string;      // yyyy-MM-dd HH:mm:ss
  total: number;
  totalInitialAmount: number;
  status: string;
  roomPrice: number;
  extraCosts: ExtraCost[];
  services: ServiceDetail[];
}

export interface UpdateInvoice {
  dueDate: string; // yyyy-MM-dd (DateOnly bên backend => string ở frontend)
  status: string;  // Enum dạng string (Paid, Unpaid, Overdue...)
  extraCosts: UpdateExtraCost[];
  invoiceDetails: UpdateInvoiceDetail[];
}

export interface UpdateExtraCost {
  extraCostID: number;
  description: string;
  amount: number;
}

export interface UpdateInvoiceDetail {
  serviceID: number;
  quantity: number;
}

export interface ServiceDraftDto {
  serviceID: number;
  name: string;
  unit: string;
}

export interface InvoiceDraftDto {
  contractID: number;
  roomNumber: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  services: ServiceDraftDto[];
}

export interface BatchInvoiceDto {
  contractId: number;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  description?: string;
  services: {
    serviceId: number;
    quantity: number;
  }[];
  extraCosts: {
    description: string;
    amount: number;
  }[];
}
