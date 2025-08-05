namespace BACKEND.DTOs.InvoiceDTO
{
    public class InvoiceDraftDto
    {
        public int ContractID { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public DateOnly PeriodStart { get; set; }
        public DateOnly PeriodEnd { get; set; }
        public DateOnly DueDate { get; set; }
        public List<ServiceDraftDto> Services { get; set; } = new();
    }

    public class ServiceDraftDto
    {
        public int ServiceID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
    }

}
