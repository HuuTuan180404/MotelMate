namespace BACKEND.DTOs.InvoiceDTO
{
    public class ReadInvoiceDTO
    {
        public int InvoiceID { get; set; }
        public string InvoiceCode { get; set; } = string.Empty;
        public string Building { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
        public string Month { get; set; } = string.Empty; // format "yyyy-MM"
        public DateOnly Due { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; } = string.Empty; // Convert từ Enum
    }
    public class ReadInvoiceDetailDTO
    {
        public int InvoiceID { get; set; }
        public string InvoiceCode { get; set; } = string.Empty;
        public string Building { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
        public string Month { get; set; } = string.Empty; // yyyy-MM
        public string PeriodStart { get; set; } = string.Empty; // yyyy-MM-dd
        public string PeriodEnd { get; set; } = string.Empty;   // yyyy-MM-dd
        public string Due { get; set; } = string.Empty;         // yyyy-MM-dd
        public string CreateAt { get; set; } = string.Empty;    // yyyy-MM-dd HH:mm:ss
        public decimal Total { get; set; }
        public decimal TotalInitialAmount { get; set; } // Cột đã lưu sẵn trong DB
        public string Status { get; set; } = string.Empty;

        public List<ExtraCostDTO> ExtraCosts { get; set; } = new();
        public List<ServiceDetailDTO> Services { get; set; } = new();
    }

    public class ExtraCostDTO
    {
        public int ExtraCostID { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class ServiceDetailDTO
    {
        public int ServiceID { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal InitialPrice { get; set; } 
        public decimal Price { get; set; } // Giá thực tế (CustomerPrice * Quantity), đã lưu trong InvoiceDetail.Price
    }
}