namespace BACKEND.DTOs
{
    using System;
    using BACKEND.Enums;

    public partial class Invoice
    {
        public int InvoiceID { get; set; }
        public string InvoiceCode { get; set; }
        public DateTime CreateAt { get; set; }
        public DateOnly PeriodStart { get; set; }
        public DateOnly PeriodEnd { get; set; }
        public EInvoiceStatus Status { get; set; }
        public decimal ExtraCosts { get; set; }
         public decimal TotalAmount { get; set; }
        public Nullable<int> ContractID { get; set; }
        public string? Description { get; set; }

    }
}
