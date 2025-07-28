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
  description: string;
  amount: number;
}

export interface ServiceDetail {
  name: string;
  quantity: number;
  unit: string;
  initialPrice: number;
  price: number;
}

export interface ReadInvoiceDetail {
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
  extraCosts: ExtraCost[];
  services: ServiceDetail[];
}
