namespace BACKEND.DTOs.InvoiceDTO
{
    public class BatchInvoiceDto
    {
        public int ContractId { get; set; }
        public DateOnly PeriodStart { get; set; }
        public DateOnly PeriodEnd { get; set; }
        public DateOnly DueDate { get; set; }
        public string? Description { get; set; }
        public List<ServiceItemDto> Services { get; set; } = new();
        public List<ExtraCostDto> ExtraCosts { get; set; } = new();
    }

    public class ServiceItemDto
    {
        public int ServiceId { get; set; }
        public int Quantity { get; set; }
    }

    public class ExtraCostDto
    {
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

}